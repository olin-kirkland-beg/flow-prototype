<template>
    <ModalFrame>
        <template v-slot:header>
            <ModalHeader closeButton :closeButtonAction="onClickCancel">
                <h2>{{ props.title }}</h2>
            </ModalHeader>
        </template>
        <template v-slot:content>
            <div class="confirm">
                <p v-html="props.message"></p>

                <div class="choices">
                    <Button class="btn" @click="onClickCancel">
                        <span>{{
                            props.cancelText ||
                            useI18n().t('UI.Modals.Confirm.Controls.cancel')
                        }}</span>
                    </Button>
                    <Button
                        class="btn"
                        :primary="props.isConfirmButtonPrimary"
                        :danger="props.isConfirmButtonDanger"
                        @click="props.onConfirm"
                    >
                        <span>{{
                            props.confirmText ||
                            useI18n().t('UI.Modals.Confirm.Controls.confirm')
                        }}</span>
                    </Button>
                </div>
            </div>
        </template>
    </ModalFrame>
</template>

<script setup lang="ts">
import ModalFrame from '@/components/modals/ModalFrame.vue';
import ModalHeader from '@/components/modals/ModalHeader.vue';
import ModalController from '@/controllers/modal-controller';
import { useI18n } from 'vue-i18n';

const props = defineProps<{
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel?: () => void;
    confirmText?: string;
    cancelText?: string;
    isConfirmButtonPrimary?: boolean;
    isConfirmButtonDanger?: boolean;
}>();

function onClickCancel() {
    props.onCancel ? props.onCancel() : ModalController.close();
}
</script>

<style scoped lang="scss">
.confirm {
    display: flex;
    max-width: 64rem;
    flex-direction: column;
    gap: 1.6rem;
    justify-content: space-between;
    height: 100%;
}

.choices {
    display: flex;
    gap: 0.8rem;
    justify-content: center;
}

@media (max-width: 768px) {
    .choices {
        flex-direction: column;
    }
}
</style>
