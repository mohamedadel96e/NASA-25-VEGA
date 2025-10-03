import { atom } from 'jotai'
import type { ModelArgs } from './types/ModelArgs';
import type { ControlMode } from './types/ControlMode';
import * as THREE from 'three';

export const backgroundMusic = atom<string>("/audio/space-travel-153309.mp3");
export const backgroundMusicVolume = atom<number>(0.5);
export const soundEffects = atom<boolean>(true);
export const modelsArgs = atom<ModelArgs[]>([]);
export const Mode = atom<ControlMode>("hand");

export const selectedModel = atom<ModelArgs | null>(null);

export const CursorPosition = atom(new THREE.Vector3());
