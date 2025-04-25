import Scene from '@/scene';
import { v4 as uuid } from 'uuid';

export default class Project {
    id: string;
    name: string;
    description: string;
    createdAt: number;
    updatedAt: number;
    scenes: Scene[];

    constructor(name: string, description: string) {
        this.id = uuid();
        this.name = name;
        this.description = description;
        this.createdAt = Date.now();
        this.updatedAt = Date.now();
        this.scenes = [];
    }

    static saveToFile(project: Project) {
        console.log('Saving project to file...');
        // Save the project to a file
        const projectData = JSON.stringify(project, null, 2);
        const blob = new Blob([projectData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${project.name}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}
