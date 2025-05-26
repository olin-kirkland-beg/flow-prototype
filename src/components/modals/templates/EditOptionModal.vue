<template>
    <ModalFrame>
        <template v-slot:header>
            <ModalHeader close-button>
                <h2>{{ t('Modals.Edit-option.title') }}</h2>
            </ModalHeader>
        </template>
        <template v-slot:content>
            <div class="edit-option">
                <section>
                    <!-- Label -->
                    <InputGroup v-model="option.label" :placeholder="t('Modals.Edit-option.label-placeholder')">
                        {{ t('Modals.Edit-option.label') }}
                    </InputGroup>
                </section>
                <Card overflow>
                    <!-- Condition -->
                    <p v-html="t('Modals.Edit-option.Condition.instructions')"></p>
                    <div class="condition-inputs">
                        <div class="combo-box-details combo-box-details--address">
                            <ul class="suggestion-options">
                                <li
                                    v-for="value in ['off', 'all']"
                                    :key="value"
                                    :class="{ selected: addressSuggestions === value }"
                                    @click="addressSuggestions = value"
                                >
                                    {{ t(`Modals.Edit-option.Suggestions.${value}`) }}
                                </li>
                            </ul>
                            <ComboBox
                                v-model="option.condition!.address"
                                :options="addressList"
                                :placeholder="t('Modals.Edit-option.Condition.address-placeholder')"
                            >
                                {{ t('Modals.Edit-option.Condition.address') }}
                            </ComboBox>
                        </div>
                        <div class="combo-box-details combo-box-details--command">
                            <ul class="suggestion-options">
                                <li
                                    v-for="value in ['off', 'all']"
                                    :key="value"
                                    :class="{ selected: commandSuggestions === value }"
                                    @click="commandSuggestions = value"
                                >
                                    {{ t(`Modals.Edit-option.Suggestions.${value}`) }}
                                </li>
                            </ul>
                            <ComboBox
                                v-model="option.condition!.command"
                                :options="commandList"
                                :placeholder="t('Modals.Edit-option.Condition.command-placeholder')"
                            >
                                {{ t('Modals.Edit-option.Condition.command') }}
                            </ComboBox>
                            <Transition name="shelf-transition" mode="out-in">
                                <div class="details" v-if="commandReadableName && commandReadableDescription">
                                    <i class="fas fa-info-circle"></i>
                                    <div>
                                        <p>
                                            <strong>{{ t(commandReadableName) }}</strong>
                                        </p>
                                        <p>{{ t(commandReadableDescription) }}</p>
                                    </div>
                                </div>
                            </Transition>
                        </div>
                    </div>
                </Card>
                <Card>
                    <!-- Choose target -->
                    <div class="flex spread full-width">
                        <div>
                            <h3>{{ t('Modals.Edit-option.Target.title') }}</h3>
                            <p
                                v-if="targetName"
                                v-html="t('Modals.Edit-option.Target.description', { name: targetName as string })"
                            ></p>
                            <p v-else>{{ t('Modals.Edit-option.Target.description-no-target') }}</p>
                        </div>
                        <Button @click="onClickUnlinkOption" :disabled="!targetName">
                            <span> {{ t('Modals.Edit-option.Target.unlink') }}</span>
                        </Button>
                    </div>
                </Card>
                <Card>
                    <div class="flex spread full-width">
                        <div>
                            <h3>{{ t('Modals.Edit-option.Delete.title') }}</h3>
                            <p>{{ t('Modals.Edit-option.Delete.description') }}</p>
                        </div>
                        <Button @click="onClickRemoveOption">
                            <i class="fas fa-trash"></i>
                            <span>{{ t('Modals.Edit-option.Delete.delete') }}</span>
                        </Button>
                    </div>
                </Card>
                <h4 class="ellipsis">{{ option.id }}</h4>
            </div>
        </template>
    </ModalFrame>
</template>

<script setup lang="ts">
import DALI_COMMANDS from '@/assets/data/dali-commands.json';
import ModalFrame from '@/components/modals/ModalFrame.vue';
import ModalHeader from '@/components/modals/ModalHeader.vue';
import Card from '@/components/ui/Card.vue';
import ComboBox from '@/components/ui/ComboBox.vue';
import InputGroup from '@/components/ui/InputGroup.vue';
import ModalController from '@/controllers/modal-controller';
import { t } from '@/i18n/locale';
import { useProjectsStore } from '@/store/projects-store';
import { computed, ref } from 'vue';

const props = defineProps({
    dialogueId: {
        type: String,
        required: true
    },
    projectId: {
        type: String,
        required: true
    },
    sceneId: {
        type: String,
        required: true
    },
    optionId: {
        type: String,
        required: true
    },
    edge: {
        type: Object,
        required: false
    }
});

const projectStore = useProjectsStore();
const project = projectStore.getProject(props.projectId);
const scene = projectStore.getScene(props.projectId, props.sceneId);
const dialogue = projectStore.getDialogue(props.projectId, props.sceneId, props.dialogueId);
const option = projectStore.getOption(props.projectId, props.sceneId, props.dialogueId, props.optionId)!;

const targetName = ref(determineTargetName());

const addressSuggestions = ref('all');
const commandSuggestions = ref('all');

const commandReadableName = computed(() => {
    const commandLabel = DALI_COMMANDS.find((cmd) => cmd.value === option.condition?.command)?.label;
    if (!commandLabel) return null;
    return `DALI-commands-readable.${commandLabel}.label`;
});
const commandReadableDescription = computed(() => {
    const commandDescription = DALI_COMMANDS.find((cmd) => cmd.value === option.condition?.command)?.label;
    if (!commandDescription) return null;
    return `DALI-commands-readable.${commandDescription}.description`;
});

const addressList = computed(() => {
    // Get all the addresses from this project
    const project = projectStore.getProject(props.projectId);
    const allAddresses: { value: string; label: string }[] = [];
    project?.scenes.forEach((scene) => {
        scene.dialogues.forEach((dialogue) => {
            dialogue.data.options.forEach((option) => {
                if (
                    option.condition?.address &&
                    !allAddresses.some((addr) => addr.value === option.condition?.address)
                ) {
                    allAddresses.push({
                        value: option.condition.address,
                        label: option.condition.address
                    });
                }
            });
            dialogue.data.actions.forEach((action) => {
                if (action.address && !allAddresses.some((address) => address.value === action.address)) {
                    allAddresses.push({
                        value: action.address,
                        label: action.address
                    });
                }
            });
        });
    });

    return addressSuggestions.value === 'all' ? allAddresses : [];
});

const commandList = computed(() => {
    const commands = DALI_COMMANDS.map((command) => ({
        value: command.value,
        label: command.value
    }));

    return commandSuggestions.value === 'all' ? commands : [];
});

function determineTargetName() {
    if (!props.edge) return null;
    const targetDialogue = useProjectsStore().getDialogue(props.projectId, props.sceneId, props.edge.target);
    return targetDialogue ? targetDialogue.data.label : null;
}

function onClickUnlinkOption() {
    projectStore.removeEdge(props.projectId, props.sceneId, props.edge?.id);
    targetName.value = null;
}

function onClickRemoveOption() {
    projectStore.removeOption(props.projectId, props.sceneId, props.dialogueId, props.optionId);
    ModalController.close();
}
</script>

<style scoped lang="scss">
.edit-option {
    display: flex;
    max-width: 72rem;
    flex-direction: column;
    gap: 1.6rem;
    justify-content: space-between;
    height: 100%;
}

.condition-inputs {
    display: flex;
    align-items: flex-start;
    gap: 1.6rem;
    white-space: nowrap;
    width: 100%;
    margin-bottom: 0;

    .combo-box-details {
        flex: 1;
        .details {
            overflow: hidden;
            display: flex;
            gap: 0.8rem;
            width: 100%;
            padding: 0.8rem;
            align-items: center;

            > i {
                font-size: 2rem;
            }
        }

        // &--address {
        // }

        // &--command {
        // }
    }
}

// Shelf Transition
.shelf-transition-enter-active,
.shelf-transition-leave-active {
    transition: all 0.2s ease;
    max-height: 10rem;
}

.shelf-transition-enter-from,
.shelf-transition-leave-to {
    max-height: 0;
}

.suggestion-options {
    display: flex;
    padding: 0.2rem;
    gap: 0.4rem;
    justify-content: flex-end;
    > li {
        cursor: pointer;
        font-size: 1.2rem;
        opacity: 0.4;
        &.selected {
            opacity: 1;
        }
    }
}
</style>
