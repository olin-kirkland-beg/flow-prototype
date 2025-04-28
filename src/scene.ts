import { v4 as uuid } from 'uuid';
import Dialogue from './dialogue';
import { Edge } from '@vue-flow/core';

export default class Scene {
    id: string;
    name: string;
    description: string;
    dialogues: Dialogue[]; // Used by Vue Flow
    edges: Edge[]; // Used by Vue Flow

    constructor(name: string) {
        this.id = uuid();
        this.name = name;
        this.description = '';
        this.dialogues = [];
        this.edges = [];
    }
}
