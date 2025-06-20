<template>
    <ModalFrame>
        <template v-slot:header>
            <ModalHeader closeButton>
                <h2>{{ t('Modals.Scene-settings.title') }}</h2>
            </ModalHeader>
        </template>
        <template v-slot:content>
            <div class="scene-settings">
                <section>
                    <InputGroup v-model="scene.name" :placeholder="t('Modals.Scene-settings.name')">
                        <span>{{ t('Modals.Scene-settings.name') }}</span>
                    </InputGroup>
                    <InputGroup v-model="scene.description" :placeholder="t('Modals.Scene-settings.description')">
                        <span>{{ t('Modals.Scene-settings.description') }}</span>
                    </InputGroup>
                    <InputGroup v-model="scene.remoteId" :placeholder="t('Modals.Scene-settings.remote-id')">
                        <span>{{ t('Modals.Scene-settings.remote-id') }}</span>
                    </InputGroup>
                </section>

                <section>
                    <Card>
                        <div class="flex spread full-width">
                            <div>
                                <h3>{{ t('Modals.Scene-settings.Delete-scene.title') }}</h3>
                                <p>{{ t('Modals.Scene-settings.Delete-scene.description') }}</p>
                            </div>
                            <Button
                                @click="onClickDeleteScene"
                                danger
                                @mouseover="
                                    TooltipController.open(InfoTooltip, {
                                        html: t('Modals.Scene-settings.Delete-scene.tooltip'),
                                        target: $event.currentTarget,
                                        position: 'bottom'
                                    })
                                "
                            >
                                <i class="fas fa-exclamation-triangle"></i>
                                <span> {{ t('Modals.Scene-settings.Delete-scene.button') }} </span>
                            </Button>
                        </div>
                    </Card>
                </section>
                <section>
                    <h4>{{ scene.id }}</h4>
                </section>
            </div>
        </template>
    </ModalFrame>
</template>

<script setup lang="ts">
import ModalFrame from '@/components/modals/ModalFrame.vue';
import ModalHeader from '@/components/modals/ModalHeader.vue';
import InfoTooltip from '@/components/tooltips/templates/InfoTooltip.vue';
import Button from '@/components/ui/Button.vue';
import InputGroup from '@/components/ui/InputGroup.vue';
import ModalController from '@/controllers/modal-controller';
import TooltipController from '@/controllers/tooltip-controller';
import { t } from '@/i18n/locale';
import Project from '@/project';
import Scene from '@/scene';
import { useProjectsStore } from '@/store/projects-store';
import ConfirmModal from './ConfirmModal.vue';
import SceneSettingsModal from './SceneSettingsModal.vue';

const props = defineProps<{
    project: Project;
    scene: Scene;
}>();

function onClickDeleteScene() {
    ModalController.close();
    ModalController.open(ConfirmModal, {
        title: t('Modals.Delete-scene.title'),
        message: t('Modals.Delete-scene.message'),
        confirmText: t('Modals.Delete-scene.Controls.confirm'),
        cancelText: t('Modals.Delete-scene.Controls.cancel'),
        isConfirmButtonDanger: true,
        onConfirm: () => {
            useProjectsStore().removeScene(props.project.id, props.scene.id);
            ModalController.close();
        },
        onCancel: () => {
            ModalController.close();
            ModalController.open(SceneSettingsModal, {
                project: props.project,
                scene: props.scene
            });
        }
    });
}
</script>

<style scoped lang="scss">
.scene-settings {
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
