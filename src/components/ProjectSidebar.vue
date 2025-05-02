<template>
    <!-- Left Sidebar -->
    <Panel class="sidebar sidebar--left">
        <section class="sidebar__project">
            <div class="flex">
                <Button @click="router.push({ name: PageName.HOME })">
                    <i class="fas fa-chevron-left"></i>
                    <span>{{ t('Project.back-to-home') }}</span>
                </Button>
            </div>
            <div class="sidebar__header">
                <h2>{{ project.name }}</h2>
                <Button @click="onClickOpenProjectSettings" icon>
                    <i class="fas fa-cog"></i>
                </Button>
            </div>
            <p v-if="project.description">{{ project.description }}</p>
            <p v-else>
                <em>{{ t('Project.no-description') }}</em>
            </p>
            <Button @click="onClickAddScene" full-width>
                <i class="fas fa-plus"></i>
                <span>{{ t('Project.add-scene') }}</span>
            </Button>
            <List class="scenes">
                <li v-if="project.scenes.length === 0">
                    <em>{{ t('Project.no-scenes') }}</em>
                </li>
                <li
                    v-for="scene in project.scenes"
                    :key="scene.id"
                    @click="onClickSelectScene(scene)"
                    :class="{
                        'is-selected': selectedScene?.id === scene.id
                    }"
                >
                    <div class="full-width flex spread">
                        <span>{{ scene.name }}</span>
                        <span class="muted">{{ scene.dialogues.length }}</span>
                    </div>
                </li></List
            >
        </section>
        <section class="sidebar__scene" v-if="selectedScene">
            <div class="sidebar__header">
                <h2>{{ selectedScene.name }}</h2>
                <Button @click="onClickOpenSceneSettings" icon>
                    <i class="fas fa-cog"></i>
                </Button>
            </div>
            <p v-if="selectedScene.description">
                {{ selectedScene.description }}
            </p>
            <p v-else>
                <em>{{ t('Project.no-description') }}</em>
            </p>
            <Button @click="onClickAddDialogue" full-width>
                <i class="fas fa-plus"></i>
                <span>{{ t('Project.add-dialogue') }}</span>
            </Button>
            <List class="dialogue">
                <li v-if="selectedScene?.dialogues.length === 0">
                    <em>{{ t('Project.no-dialogues') }}</em>
                </li>
                <li
                    v-for="dialogue in selectedScene?.dialogues"
                    :key="dialogue.id"
                    :class="{
                        'is-selected': selectedDialogue?.id === dialogue.id
                    }"
                    @click="onClickSelectDialogue(dialogue.id)"
                >
                    <i class="fas fa-sticky-note"></i>
                    <div class="full-width flex spread">
                        <em>{{ dialogue.data.label }}</em>
                        <!-- Connections -->
                        <div class="flex">
                            <span class="muted">
                                {{ dialogue.data.options.length }}
                            </span>
                        </div>
                    </div>
                </li>
            </List>
        </section>
    </Panel>
</template>

<script setup lang="ts">
import ModalController from '@/controllers/modal-controller';
import Dialogue from '@/dialogue';
import { t } from '@/i18n/locale';
import Project from '@/project';
import { PageName, router } from '@/router';
import Scene from '@/scene';
import { useProjectsStore } from '@/store/projects-store';
import { getUniqueName } from '@/utils/naming-util';
import ProjectSettingsModal from './modals/templates/ProjectSettingsModal.vue';
import SceneSettingsModal from './modals/templates/SceneSettingsModal.vue';
import { ref } from 'vue';

const props = defineProps<{
    project: Project;
    selectedScene: Scene | null;
    selectedDialogue: Dialogue | null;
}>();

const emit = defineEmits<{
    (e: 'selectScene', scene: Scene): void;
    (e: 'selectDialogue', id: string): void;
}>();

const projectsStore = useProjectsStore();
const foo = ref('');

function onClickOpenProjectSettings() {
    ModalController.open(ProjectSettingsModal, { project: props.project });
}

function onClickOpenSceneSettings() {
    ModalController.open(SceneSettingsModal, {
        project: props.project,
        scene: props.selectedScene
    });
}

function onClickAddScene() {
    const newScene = new Scene(
        getUniqueName(
            props.project.scenes.map((scene) => scene.name),
            t('Project.new-scene-name')
        )
    );
    projectsStore.addScene(props.project.id, newScene);
}

function onClickAddDialogue() {
    if (!props.selectedScene) return;
    const newDialogue = new Dialogue();
    projectsStore.addDialogue(props.project.id, props.selectedScene.id, newDialogue);
}

function onClickSelectScene(scene: Scene) {
    emit('selectScene', scene);
}

function onClickSelectDialogue(id: string) {
    emit('selectDialogue', id);
}
</script>

<style scoped lang="scss">
.sidebar {
    z-index: 1;
    max-width: 32rem;
    flex: 1;
    overflow: hidden;
}

.sidebar__header {
    width: 100%;
    // border-bottom: 1px solid var(--color-surface-alt);
    // Background is a gradient light gray to transparent top to down
    background: linear-gradient(to bottom, var(--color-surface) 0%, transparent 100%);

    padding-left: 0.8rem;
    border-radius: 5px;

    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-shrink: 0;
}

section {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    gap: 0.8rem;

    &:not(:last-child) {
        margin-bottom: 2.4rem;
    }
}

.sidebar__scene {
    flex: 1;
    min-height: 24rem;
    overflow: hidden;
}

.sidebar__edges {
    flex: 1;
    overflow: hidden;
}

:deep(ul.edges) {
    flex-direction: column;
    flex: 1;

    li {
        flex-direction: column;
    }
}

:deep(ul.scenes) {
    max-height: 24rem;
}

:deep(ul.dialogue) {
    flex: 1;
}
</style>
