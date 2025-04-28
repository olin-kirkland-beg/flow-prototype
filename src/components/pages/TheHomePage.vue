<template>
    <div class="page page--home">
        <Panel class="controls-panel">
            <div class="logo-header">
                <h1 class="logo">{{ t('Home.logo') }}</h1>
                <h2>{{ t('Home.subtitle') }}</h2>
            </div>

            <div class="flex">
                <Button primary @click="onClickNewProject">
                    <i class="fas fa-plus-circle"></i>
                    <span> {{ t('Home.new-project') }} </span>
                </Button>
                <Button @click="onClickLoadProject">
                    <i class="fas fa-folder-open"></i>
                    <span>{{ t('Home.load-project') }}</span>
                </Button>
            </div>
        </Panel>
        <Panel v-if="displayedProjects.length > 0" class="projects-panel">
            <h2>
                {{
                    t('Home.recent-projects', {
                        count: displayedProjects.length.toString()
                    })
                }}
            </h2>
            <ul class="projects-list">
                <ProjectCard
                    v-for="project in displayedProjects"
                    :project="project"
                    :key="project.id"
                ></ProjectCard>
            </ul>
        </Panel>
        <footer>
            <StorageMeter
                :usedBytes="projectsStore.bytesUsedEstimate()"
                :maxBytes="5 * 1024 * 1024"
            />
        </footer>
    </div>
</template>

<script setup lang="ts">
import Button from '@/components/ui/Button.vue';
import Panel from '@/components/ui/Panel.vue';
import StorageMeter from '@/components/ui/StorageMeter.vue';
import ModalController from '@/controllers/modal-controller';
import { t } from '@/i18n/locale';
import Project from '@/project';
import { PageName, router } from '@/router';
import { useProjectsStore } from '@/store/projects-store';
import { v4 as uuid } from 'uuid';
import { onMounted, ref } from 'vue';
import InfoModal from '../modals/templates/InfoModal.vue';
import LoadingModal from '../modals/templates/LoadingModal.vue';
import ProjectCard from '../ProjectCard.vue';

const projectsStore = useProjectsStore();
const displayedProjects = ref<Project[]>([]);

onMounted(updateDisplayedProjects);

function updateDisplayedProjects() {
    // Update displayedProjects with the projects from the store
    displayedProjects.value = [...projectsStore.projects].sort((a, b) => {
        // Sort by last modified date (most recent first)
        return b.updatedAt - a.updatedAt;
    });
}

function onClickNewProject() {
    const newProject = new Project(
        'New Project',
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
    );

    projectsStore.addProject(newProject);

    // Open the new project in the editor
    router.push({
        name: PageName.PROJECT,
        params: { id: newProject.id }
    });
}

function onClickLoadProject() {
    ModalController.open(LoadingModal);
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.json'; // Accept only .json files
    fileInput.multiple = false;
    fileInput.addEventListener('change', async (event) => {
        const { files } = event.target as HTMLInputElement;
        if (!files || files.length === 0) return;
        const file = files[0];
        const reader = new FileReader();
        reader.onload = async (e) => {
            const fileContent = e.target?.result as string;
            try {
                const newProject = JSON.parse(fileContent) as Project;
                newProject.id = uuid();
                projectsStore.addProject(newProject);
                updateDisplayedProjects();
                ModalController.close();
                ModalController.open(InfoModal, {
                    title: t('Modals.Load-project-success.title'),
                    message: t('Modals.Load-project-success.message', {
                        name: newProject.name
                    })
                });
            } catch (error) {
                console.error('Error loading project:', error);
                ModalController.close();
                ModalController.open(InfoModal, {
                    title: t('Modals.Load-project-error.title'),
                    message: t('Modals.Load-project-error.message', {
                        name: file.name,
                        error: (error as Error).message
                    }),
                    mode: 'danger'
                });
            }
        };

        reader.readAsText(file);
    });
    fileInput.addEventListener('cancel', (event) => {
        console.log(event);
        ModalController.close();
    });
    fileInput.click();
}
</script>

<style lang="scss" scoped>
.panel {
    width: 100%;
    max-width: 64rem;

    &.controls-panel {
        flex: 0 0 auto;
    }
}

.logo-header {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    margin-bottom: 0.8rem;

    > h2 {
        opacity: 0.5;
    }
}

h1.logo {
    font-size: 4rem;
    text-shadow: 0.2rem 0.2rem 0 var(--color-surface-alt);
}

.projects-list {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.2rem;
}

footer {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    padding: 1.2rem;
}
</style>
