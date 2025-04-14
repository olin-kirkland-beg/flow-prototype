<template>
    <ModalFrame>
        <template v-slot:header>
            <ModalHeader closeButton>
                <h2>Project Settings</h2>
            </ModalHeader>
        </template>
        <template v-slot:content>
            <div class="project-settings">
                <section>
                    <p><strong>Project ID:</strong> {{ project.id }}</p>
                    <InputGroup
                        v-model="project.name"
                        placeholder="Project name"
                    >
                        <span>Name</span>
                    </InputGroup>
                    <InputGroup
                        v-model="project.description"
                        placeholder="Project description"
                    >
                        <span>Description</span>
                    </InputGroup>
                    <div class="flex">
                        <Badge
                            color="var(--color-surface-alt)"
                            :useLightText="true"
                        >
                            <span
                                >Created
                                {{
                                    new Date(
                                        project.createdAt
                                    ).toLocaleDateString()
                                }}
                            </span>
                        </Badge>
                        <Badge
                            color="var(--color-surface-alt)"
                            :useLightText="true"
                        >
                            <span
                                >Modified
                                {{
                                    new Date(project.updatedAt).toLocaleString()
                                }}</span
                            >
                        </Badge>
                    </div>
                </section>

                <Button @click="onClickDeleteProject" danger>
                    <i class="fas fa-exclamation-triangle"></i>
                    <span>Delete Project</span>
                </Button>
            </div>
        </template>
    </ModalFrame>
</template>

<script setup lang="ts">
import ModalFrame from '@/components/modals/ModalFrame.vue';
import ModalHeader from '@/components/modals/ModalHeader.vue';
import Badge from '@/components/ui/Badge.vue';
import Button from '@/components/ui/Button.vue';
import InputGroup from '@/components/ui/InputGroup.vue';
import ModalController from '@/controllers/modal-controller';
import { t } from '@/i18n/locale';
import Project from '@/project';
import { PageName, router } from '@/router';
import { useProjectsStore } from '@/store/projects-store';
import ConfirmModal from './ConfirmModal.vue';
import ProjectSettingsModal from './ProjectSettingsModal.vue';

const props = defineProps<{
    project: Project;
}>();

function onClickDeleteProject() {
    ModalController.close();
    ModalController.open(ConfirmModal, {
        title: t('UI.Modals.Delete-project.title'),
        message: t('UI.Modals.Delete-project.message'),
        confirmText: t('UI.Modals.Delete-project.Controls.confirm'),
        cancelText: t('UI.Modals.Delete-project.Controls.cancel'),
        isConfirmButtonDanger: true,
        onConfirm: () => {
            router.push({ name: PageName.HOME });
            useProjectsStore().removeProject(props.project.id);
            ModalController.close();
        },
        onCancel: () => {
            ModalController.close();
            ModalController.open(ProjectSettingsModal, {
                project: props.project
            });
        }
    });
}
</script>

<style scoped lang="scss">
.project-settings {
    display: flex;
    max-width: 64rem;
    flex-direction: column;
    gap: 1.6rem;
    justify-content: flex-start;
    align-items: flex-start;
    height: 100%;
}

section {
    display: flex;
    width: 40rem;
    flex-direction: column;
    gap: 0.8rem;
}
</style>
