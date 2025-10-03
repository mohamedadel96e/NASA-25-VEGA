import { atom } from 'jotai'
import type { ModelArgs } from './types/ModelArgs';

export const backgroundMusic = atom<string>("/audio/space-travel-153309.mp3");
export const backgroundMusicVolume = atom<number>(0.5);
export const soundEffects = atom<boolean>(true);
export const modelsArgs = atom<ModelArgs[]>([
    {
        name: "greenhouse",
        src: "/glb/greenhouse+3d+model.glb",
        position: [0,0,0],
        scale: 0.3,
        rotation: [0,0,0],
        info: ""
    }
]);

export const selectedModel = atom<ModelArgs | null>(null);