import { useAtom, useSetAtom } from "jotai";
import { Mode, selectedModel } from "../atoms";
import { modelsData } from "../modelsData";
import type { ModelArgs } from "../types/ModelArgs";
import { X } from "lucide-react";


export default function ModelsDisplay() {

    const setMode = useSetAtom(Mode);

    return <section className="w-[20rem] menu-theme absolute z-20 p-2 text-unselectable cols-center gap-1">
        <span className="w-full rows-between axis-center text-gray-200 gap-5 mb-2">
            <p className="text-sm font-light">
                Model Selector
            </p>
            <X
                className="w-4 h-auto cursor-pointer hocus:text-white transition-100 "
                onClick={() => setMode("hand")}
            />
        </span>
        {modelsData.map((model, index) =>
            <ModelCard key={index} model={model} />
        )}
    </section>

}


function ModelCard({ model }: { model: ModelArgs }) {

    const setSelectedModel = useSetAtom(selectedModel);

    return <div
        className="menu-theme p-2 text-gray-200 font-bold cursor-pointer"
        onClick={() => setSelectedModel(model)}
    >
        {model.name}
    </div>
}