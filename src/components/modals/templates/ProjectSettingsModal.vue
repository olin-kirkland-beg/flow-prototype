<template>
    <ModalFrame>
        <template v-slot:header>
            <ModalHeader closeButton>
                <h2>{{ t('Modals.Project-settings.title') }}</h2>
            </ModalHeader>
        </template>
        <template v-slot:content>
            <div class="project-settings">
                <section>
                    <InputGroup v-model="project.name" :placeholder="t('Modals.Project-settings.name')">
                        <span>{{ t('Modals.Project-settings.name') }}</span>
                    </InputGroup>
                    <InputGroup v-model="project.description" :placeholder="t('Modals.Project-settings.description')">
                        <span>{{ t('Modals.Project-settings.description') }}</span>
                    </InputGroup>
                    <div class="flex">
                        <Badge color="var(--color-surface-alt)" :useLightText="true">
                            <span>{{
                                t('Modals.Project-settings.created-at', {
                                    date: new Date(project.createdAt).toLocaleString()
                                })
                            }}</span>
                        </Badge>
                        <Badge color="var(--color-surface-alt)" :useLightText="true">
                            <span>{{
                                t('Modals.Project-settings.updated-at', {
                                    date: new Date(project.updatedAt).toLocaleString()
                                })
                            }}</span>
                        </Badge>
                    </div>
                </section>

                <section>
                    <Card>
                        <div class="flex spread full-width">
                            <div>
                                <h3>
                                    {{ t('Modals.Project-settings.Save-to-file.title') }}
                                </h3>
                                <p>
                                    {{ t('Modals.Project-settings.Save-to-file.description') }}
                                </p>
                            </div>
                            <Button
                                @click="onClickSaveProjectToFile"
                                @mouseover="
                                    TooltipController.open(InfoTooltip, {
                                        html: `${toFileName(project.name)}.json`,
                                        target: $event.currentTarget,
                                        position: 'bottom'
                                    })
                                "
                            >
                                <i class="fas fa-file-download"></i>
                                <span>
                                    {{ t('Modals.Project-settings.Save-to-file.button') }}
                                </span>
                            </Button>
                        </div>
                    </Card>
                </section>

                <section>
                    <Card>
                        <div class="flex spread full-width">
                            <div>
                                <h3>{{ t('Modals.Project-settings.Export.title') }}</h3>
                                <p>{{ t('Modals.Project-settings.Export.description') }}</p>
                            </div>
                            <Button
                                @click="onClickExportProjectForDaliSys"
                                @mouseover="
                                    TooltipController.open(InfoTooltip, {
                                        html: `${toFileName(project.name)}.zip`,
                                        target: $event.currentTarget,
                                        position: 'bottom'
                                    })
                                "
                            >
                                <i class="fas fa-file-download"></i>
                                <span>
                                    {{ t('Modals.Project-settings.Export.button') }}
                                </span>
                            </Button>
                        </div>
                    </Card>
                </section>

                <section>
                    <Card>
                        <div class="flex spread full-width">
                            <div>
                                <h3>{{ t('Modals.Project-settings.Delete-project.title') }}</h3>
                                <p>{{ t('Modals.Project-settings.Delete-project.description') }}</p>
                            </div>
                            <Button
                                @click="onClickDeleteProject"
                                danger
                                @mouseover="
                                    TooltipController.open(InfoTooltip, {
                                        html: t('Modals.Project-settings.Delete-project.tooltip'),
                                        target: $event.currentTarget,
                                        position: 'bottom'
                                    })
                                "
                            >
                                <i class="fas fa-exclamation-triangle"></i>
                                <span> {{ t('Modals.Project-settings.Delete-project.button') }} </span>
                            </Button>
                        </div>
                    </Card>
                </section>
                <section>
                    <h4>{{ project.id }}</h4>
                </section>
            </div>
        </template>
    </ModalFrame>
</template>

<script setup lang="ts">
import ModalFrame from '@/components/modals/ModalFrame.vue';
import ModalHeader from '@/components/modals/ModalHeader.vue';
import InfoTooltip from '@/components/tooltips/templates/InfoTooltip.vue';
import Badge from '@/components/ui/Badge.vue';
import Button from '@/components/ui/Button.vue';
import InputGroup from '@/components/ui/InputGroup.vue';
import ModalController from '@/controllers/modal-controller';
import TooltipController from '@/controllers/tooltip-controller';
import { t } from '@/i18n/locale';
import Project from '@/project';
import { PageName, router } from '@/router';
import { useProjectsStore } from '@/store/projects-store';
import { toFileName } from '@/utils/naming-util';
import ConfirmModal from './ConfirmModal.vue';
import ProjectSettingsModal from './ProjectSettingsModal.vue';

const props = defineProps<{
    project: Project;
}>();

function onClickSaveProjectToFile() {
    Project.saveToFile(toFileName(props.project.name), props.project);
}

function onClickExportProjectForDaliSys() {
    Project.exportForDaliSys(toFileName(props.project.name), props.project);
}

function onClickDeleteProject() {
    ModalController.close();
    ModalController.open(ConfirmModal, {
        title: t('Modals.Delete-project.title'),
        message: t('Modals.Delete-project.message'),
        confirmText: t('Modals.Delete-project.Controls.confirm'),
        cancelText: t('Modals.Delete-project.Controls.cancel'),
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
    width: 48rem;
    flex-direction: column;
    gap: 0.8rem;
}

.options {
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: center;
    gap: 0.8rem;
}
</style>
