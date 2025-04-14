<template>
    <!-- Left Sidebar -->
    <Panel class="sidebar sidebar--left">
        <section class="sidebar__project">
            <div class="flex">
                <Button @click="router.push({ name: PageName.HOME })">
                    <i class="fas fa-chevron-left"></i>
                    <span>Home</span>
                </Button>
            </div>
            <div class="sidebar__header">
                <h2>{{ project.name }}</h2>
            </div>
            <InputGroup v-model="project.name" placeholder="Project name">
                <span>Project Name</span>
            </InputGroup>
            <InputGroup
                v-model="project.description"
                placeholder="Project description"
            >
                <span>Description</span>
            </InputGroup>
            <div class="flex full-width">
                <Button @click="onClickAddScene" full-width primary>
                    <i class="fas fa-plus"></i>
                    <span>Add Scene</span>
                </Button>
                <Button @click="onClickOpenProjectSettings" full-width>
                    <i class="fas fa-cog"></i>
                    <span>Settings</span>
                </Button>
            </div>
            <List class="scenes">
                <li v-if="project.scenes.length === 0">
                    <em>No scenes yet.</em>
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
            </div>
            <InputGroup v-model="selectedScene.name" placeholder="Project name">
                <span>Scene Name</span>
            </InputGroup>
            <InputGroup
                v-model="selectedScene.description"
                placeholder="Scene description"
            >
                <span>Description</span>
            </InputGroup>
            <div class="flex full-width">
                <Button @click="onClickAddDialogue" full-width>
                    <i class="fas fa-plus"></i>
                    <span>Add State</span>
                </Button>
                <Button @click="onClickDeleteScene" full-width>
                    <i class="fas fa-trash"></i>
                    <span>Delete</span>
                </Button>
                <!-- <Button @click="onClickOpenSceneSettings" icon>
                    <i class="fas fa-cog"></i>
                </Button> -->
            </div>
            <List class="dialogue">
                <li v-if="selectedScene?.dialogues.length === 0">
                    <em>No dialogues yet.</em>
                </li>
                <li
                    v-for="dialogue in selectedScene?.dialogues"
                    :key="dialogue.id"
                    :class="{
                        'is-selected': selectedDialogue?.id === dialogue.id
                    }"
                    @click="onClickSelectDialogue(dialogue)"
                >
                    <i class="fas fa-sticky-note"></i>
                    <div class="full-width flex spread">
                        <em>{{ dialogue.id.substring(0, 8) }}</em>
                        <span class="muted">
                            {{
                                dialogue.data.options.filter(
                                    (option) => option.nextDialogueId
                                ).length
                            }}/{{ dialogue.data.options.length }}</span
                        >
                    </div>
                </li>
            </List>
        </section>
        <section class="sidebar__edges" v-if="selectedScene">
            <h2>Edges</h2>
            <List class="edges">
                <li v-if="selectedScene.edges.length === 0">
                    <em>No edges yet.</em>
                </li>
                <li v-for="edge in selectedScene.edges" :key="edge.id">
                    <p>source</p>
                    <Badge color="var(--color-surface-alt)">
                        <span>{{ edge.source }}</span></Badge
                    >
                    <p>sourceHandle</p>
                    <Badge color="var(--color-surface-alt)">
                        <span>{{ edge.sourceHandle }}</span></Badge
                    >
                    <p>target</p>
                    <Badge color="var(--color-surface-alt)">
                        <span>{{ edge.target }}</span></Badge
                    >
                </li></List
            >
        </section>
    </Panel>
</template>

<script setup lang="ts">
import { t } from '@/i18n/locale';
import ConfirmModal from '@/components/modals/templates/ConfirmModal.vue';
import ModalController from '@/controllers/modal-controller';
import Dialogue from '@/dialogue';
import Project from '@/project';
import { PageName, router } from '@/router';
import Scene from '@/scene';
import { useProjectsStore } from '@/store/projects-store';
import ProjectSettingsModal from './modals/templates/ProjectSettingsModal.vue';
import SceneSettingsModal from './modals/templates/SceneSettingsModal.vue';
import Badge from './ui/Badge.vue';

const props = defineProps<{
    project: Project;
    selectedScene: Scene | null;
    selectedDialogue: Dialogue | null;
}>();

const emit = defineEmits<{
    (e: 'selectScene', scene: Scene): void;
    (e: 'selectDialogue', dialogue: Dialogue): void;
}>();

const projectsStore = useProjectsStore();

function onClickOpenProjectSettings() {
    ModalController.open(ProjectSettingsModal, { project: props.project });
}

function onClickOpenSceneSettings() {
    ModalController.open(SceneSettingsModal, {
        project: props.project,
        scene: props.selectedScene
    });
}

function onClickDeleteScene() {
    if (!props.selectedScene) return;
    ModalController.open(ConfirmModal, {
        title: t('UI.Modals.Delete-scene.title'),
        message: t('UI.Modals.Delete-scene.message'),
        confirmText: t('UI.Modals.Delete-scene.Controls.confirm'),
        cancelText: t('UI.Modals.Delete-scene.Controls.cancel'),
        isConfirmButtonDanger: true,
        onConfirm: () => {
            useProjectsStore().removeScene(
                props.project.id,
                props.selectedScene.id
            );
            // Deselect the scene
            emit('selectScene', null);
            ModalController.close();
        }
    });
}

function onClickAddScene() {
    const newScene = new Scene('Untitled Scene', 'Lorem ipsum dolor sit amet.');
    projectsStore.addScene(props.project.id, newScene);
}

function onClickAddDialogue() {
    if (!props.selectedScene) return;
    const newDialogue = new Dialogue();
    projectsStore.addDialogue(
        props.project.id,
        props.selectedScene.id,
        newDialogue
    );
}

function onClickSelectScene(scene: Scene) {
    emit('selectScene', scene);
}

function onClickSelectDialogue(dialogue: Dialogue) {
    emit('selectDialogue', dialogue);
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
    border-bottom: 1px solid var(--color-surface-alt);
    display: flex;
    justify-content: space-between;
    align-items: center;
    // Don't shrink
    flex-shrink: 0;
    padding-bottom: 0.8rem;
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
