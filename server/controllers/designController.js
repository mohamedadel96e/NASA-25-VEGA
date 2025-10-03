const Design = require('../models/Design');
const { validateDesign, validateDesignEnhanced } = require('../utils/validation');

const getDesigns = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search, tags, destination } = req.query;
    
    const query = { userId: req.user.id };
    
    // Add search filter
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Add tags filter
    if (tags) {
      const tagArray = tags.split(',').map(tag => tag.trim());
      query.tags = { $in: tagArray };
    }
    
    // Add destination filter
    if (destination) {
      query.destination = destination;
    }

    const designs = await Design.find(query)
      .sort({ updatedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-components'); // Exclude components for list view

    const total = await Design.countDocuments(query);

    res.status(200).json({
      success: true,
      count: designs.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      designs: designs.map(design => ({
        id: design._id,
        name: design.name,
        description: design.description,
        habitat: design.habitat,
        crewSize: design.crewSize,
        missionDuration: design.missionDuration,
        destination: design.destination,
        validation: {
          isValid: design.validation.isValid,
          score: design.validation.score,
          lastValidated: design.validation.lastValidated
        },
        tags: design.tags,
        isPublic: design.isPublic,
        isTemplate: design.isTemplate,
        version: design.version,
        volumeUtilization: design.volumeUtilization,
        totalMass: design.totalMass,
        totalPowerConsumption: design.totalPowerConsumption,
        createdAt: design.createdAt,
        updatedAt: design.updatedAt
      }))
    });
  } catch (error) {
    next(error);
  }
};

const getDesign = async (req, res, next) => {
  try {
    const design = await Design.findOne({
      _id: req.params.id,
      $or: [
        { userId: req.user.id },
        { isPublic: true },
        { 'collaborators.userId': req.user.id }
      ]
    });

    if (!design) {
      return res.status(404).json({
        success: false,
        message: 'Design not found'
      });
    }

    res.status(200).json({
      success: true,
      design: {
        id: design._id,
        name: design.name,
        description: design.description,
        habitat: design.habitat,
        components: design.components,
        crewSize: design.crewSize,
        missionDuration: design.missionDuration,
        destination: design.destination,
        environment: design.environment,
        validation: design.validation,
        tags: design.tags,
        isPublic: design.isPublic,
        isTemplate: design.isTemplate,
        basedOnTemplate: design.basedOnTemplate,
        version: design.version,
        collaborators: design.collaborators,
        exports: design.exports,
        volumeUtilization: design.volumeUtilization,
        totalComponentVolume: design.totalComponentVolume,
        totalMass: design.totalMass,
        totalPowerConsumption: design.totalPowerConsumption,
        createdAt: design.createdAt,
        updatedAt: design.updatedAt
      }
    });
  } catch (error) {
    next(error);
  }
};

const createDesign = async (req, res, next) => {
  try {
    const {
      name,
      description,
      habitat,
      components = [],
      crewSize,
      missionDuration,
      destination,
      environment,
      tags = [],
      isPublic = false,
      basedOnTemplate
    } = req.body;

    // Validate required fields
    if (!name || !habitat || !crewSize || !missionDuration || !destination) {
      return res.status(400).json({
        success: false,
        message: 'Name, habitat, crew size, mission duration, and destination are required'
      });
    }

    // Calculate habitat volume
    let habitatVolume = 0;
    const { shape, dimensions } = habitat;
    
    switch (shape) {
      case 'cylinder':
        habitatVolume = Math.PI * Math.pow(dimensions.radius, 2) * dimensions.length;
        break;
      case 'sphere':
        habitatVolume = (4/3) * Math.PI * Math.pow(dimensions.radius, 3);
        break;
      case 'dome':
        habitatVolume = (2/3) * Math.PI * Math.pow(dimensions.radius, 3);
        break;
    }

    const design = await Design.create({
      userId: req.user.id,
      name,
      description,
      habitat: {
        ...habitat,
        volume: Math.round(habitatVolume * 100) / 100
      },
      components,
      crewSize,
      missionDuration,
      destination,
      environment: environment || {
        gravity: 0,
        radiation: 'medium',
        temperature: {
          internal: { min: 18, max: 24 },
          external: { min: -200, max: 150 }
        }
      },
      tags,
      isPublic,
      basedOnTemplate
    });

    res.status(201).json({
      success: true,
      message: 'Design created successfully',
      design: {
        id: design._id,
        name: design.name,
        description: design.description,
        habitat: design.habitat,
        components: design.components,
        crewSize: design.crewSize,
        missionDuration: design.missionDuration,
        destination: design.destination,
        validation: design.validation,
        volumeUtilization: design.volumeUtilization,
        totalMass: design.totalMass,
        totalPowerConsumption: design.totalPowerConsumption,
        createdAt: design.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
};

const updateDesign = async (req, res, next) => {
  try {
    let design = await Design.findOne({
      _id: req.params.id,
      $or: [
        { userId: req.user.id },
        { 'collaborators.userId': req.user.id, 'collaborators.role': { $in: ['editor', 'admin'] } }
      ]
    });

    if (!design) {
      return res.status(404).json({
        success: false,
        message: 'Design not found or insufficient permissions'
      });
    }

    // Update allowed fields
    const allowedFields = [
      'name', 'description', 'habitat', 'components', 'crewSize', 
      'missionDuration', 'destination', 'environment', 'tags', 'isPublic'
    ];
    
    const updateData = {};
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    // Recalculate habitat volume if habitat is updated
    if (updateData.habitat) {
      const { shape, dimensions } = updateData.habitat;
      let volume = 0;
      
      switch (shape) {
        case 'cylinder':
          volume = Math.PI * Math.pow(dimensions.radius, 2) * dimensions.length;
          break;
        case 'sphere':
          volume = (4/3) * Math.PI * Math.pow(dimensions.radius, 3);
          break;
        case 'dome':
          volume = (2/3) * Math.PI * Math.pow(dimensions.radius, 3);
          break;
      }
      
      updateData.habitat.volume = Math.round(volume * 100) / 100;
    }

    // Increment version
    updateData.version = design.version + 1;

    design = await Design.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      message: 'Design updated successfully',
      design: {
        id: design._id,
        name: design.name,
        description: design.description,
        habitat: design.habitat,
        components: design.components,
        crewSize: design.crewSize,
        missionDuration: design.missionDuration,
        destination: design.destination,
        validation: design.validation,
        version: design.version,
        volumeUtilization: design.volumeUtilization,
        totalMass: design.totalMass,
        totalPowerConsumption: design.totalPowerConsumption,
        updatedAt: design.updatedAt
      }
    });
  } catch (error) {
    next(error);
  }
};

const deleteDesign = async (req, res, next) => {
  try {
    const design = await Design.findOne({
      _id: req.params.id,
      $or: [
        { userId: req.user.id },
        { 'collaborators.userId': req.user.id, 'collaborators.role': 'admin' }
      ]
    });

    if (!design) {
      return res.status(404).json({
        success: false,
        message: 'Design not found or insufficient permissions'
      });
    }

    await Design.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Design deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

const validateDesignEndpoint = async (req, res, next) => {
  try {
    const { enhanced = false } = req.query; // Allow enhanced validation via query parameter
    
    const design = await Design.findOne({
      _id: req.params.id,
      $or: [
        { userId: req.user.id },
        { 'collaborators.userId': req.user.id }
      ]
    });

    if (!design) {
      return res.status(404).json({
        success: false,
        message: 'Design not found'
      });
    }

    // Run validation (enhanced or standard)
    const validationResult = enhanced === 'true' ? 
      validateDesignEnhanced(design) : 
      validateDesign(design);

    // Update design with validation results
    design.validation = {
      ...validationResult,
      lastValidated: new Date(),
      validationType: enhanced === 'true' ? 'NASA_Enhanced_NHV' : 'NASA_Standard'
    };

    await design.save();

    res.status(200).json({
      success: true,
      message: `Design validated successfully using ${enhanced === 'true' ? 'Enhanced NASA NHV Standards' : 'Standard NASA Validation'}`,
      validation: design.validation,
      nasa_info: enhanced === 'true' ? {
        standard: 'NASA Technical Report 20200002973',
        description: 'Net Habitable Volume for Long-Duration Exploration Missions',
        features: [
          'Mission-specific volume requirements',
          'Crew psychological factors',
          'System redundancy validation',
          'Accessibility standards compliance'
        ]
      } : {
        standard: 'NASA Table 17',
        description: 'Minimum Habitable Volumes',
        features: [
          'Basic volume requirements',
          'Component validation',
          'Safety checks'
        ]
      }
    });
  } catch (error) {
    next(error);
  }
};

const duplicateDesign = async (req, res, next) => {
  try {
    const originalDesign = await Design.findOne({
      _id: req.params.id,
      $or: [
        { userId: req.user.id },
        { isPublic: true },
        { 'collaborators.userId': req.user.id }
      ]
    });

    if (!originalDesign) {
      return res.status(404).json({
        success: false,
        message: 'Design not found'
      });
    }

    const { name } = req.body;
    
    const duplicatedDesign = await Design.create({
      userId: req.user.id,
      name: name || `${originalDesign.name} (Copy)`,
      description: originalDesign.description,
      habitat: originalDesign.habitat,
      components: originalDesign.components,
      crewSize: originalDesign.crewSize,
      missionDuration: originalDesign.missionDuration,
      destination: originalDesign.destination,
      environment: originalDesign.environment,
      tags: originalDesign.tags,
      basedOnTemplate: originalDesign.isTemplate ? originalDesign._id : originalDesign.basedOnTemplate,
      isPublic: false, // Duplicated designs are private by default
      version: 1
    });

    res.status(201).json({
      success: true,
      message: 'Design duplicated successfully',
      design: {
        id: duplicatedDesign._id,
        name: duplicatedDesign.name,
        description: duplicatedDesign.description,
        habitat: duplicatedDesign.habitat,
        components: duplicatedDesign.components,
        crewSize: duplicatedDesign.crewSize,
        missionDuration: duplicatedDesign.missionDuration,
        destination: duplicatedDesign.destination,
        createdAt: duplicatedDesign.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
};

const getPublicDesigns = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search, destination, tags } = req.query;
    
    const query = { 
      $or: [
        { isPublic: true },
        { isTemplate: true }
      ]
    };
    
    // Add search filter
    if (search) {
      query.$and = [
        query,
        {
          $or: [
            { name: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } }
          ]
        }
      ];
    }
    
    // Add destination filter
    if (destination) {
      query.destination = destination;
    }
    
    // Add tags filter
    if (tags) {
      const tagArray = tags.split(',').map(tag => tag.trim());
      query.tags = { $in: tagArray };
    }

    const designs = await Design.find(query)
      .populate('userId', 'name avatar')
      .sort({ 'validation.score': -1, updatedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-components');

    const total = await Design.countDocuments(query);

    res.status(200).json({
      success: true,
      count: designs.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      designs: designs.map(design => ({
        id: design._id,
        name: design.name,
        description: design.description,
        habitat: design.habitat,
        crewSize: design.crewSize,
        missionDuration: design.missionDuration,
        destination: design.destination,
        validation: {
          isValid: design.validation.isValid,
          score: design.validation.score
        },
        tags: design.tags,
        isTemplate: design.isTemplate,
        volumeUtilization: design.volumeUtilization,
        totalMass: design.totalMass,
        author: design.userId ? {
          name: design.userId.name,
          avatar: design.userId.avatar
        } : null,
        createdAt: design.createdAt,
        updatedAt: design.updatedAt
      }))
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDesigns,
  getDesign,
  createDesign,
  updateDesign,
  deleteDesign,
  validateDesignEndpoint,
  duplicateDesign,
  getPublicDesigns
};