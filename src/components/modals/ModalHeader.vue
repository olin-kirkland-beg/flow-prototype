<template>
    <div class="modal__header">
        <slot></slot>
        <Button icon class="close" v-if="closeButton" @click="onClickClose">
            <i class="fas fa-times"></i>
        </Button>
    </div>
</template>

<script setup lang="ts">
import ModalController from '@/controllers/modal-controller';

const props = defineProps({
    closeButton: Boolean,
    closeButtonAction: Function
});

function onClickClose() {
    props.closeButtonAction
        ? props.closeButtonAction()
        : ModalController.close();
}
</script>

<style lang="scss" scoped>
.modal__header {
    position: relative;
    display: flex;
    align-items: center;
    padding: 0.6rem 0.8rem 0.4rem 2rem;
    width: 100%;
    gap: 1.6rem;
    background-color: var(--color-surface);
    border-bottom: 1px solid var(--color-surface-alt);

    .close {
        margin-left: auto;
    }
}
</style>
