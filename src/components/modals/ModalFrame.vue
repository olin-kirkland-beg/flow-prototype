<template>
    <div class="modal" :class="{ overflow: props.overflow }">
        <slot name="header"></slot>
        <div class="modal__content">
            <slot name="content"></slot>
        </div>
        <div class="modal__background"></div>
    </div>
</template>

<script setup lang="ts">
const props = defineProps({
    overflow: {
        type: Boolean,
        default: false
    }
});
</script>

<style lang="scss" scoped>
.modal {
    position: relative;
    display: flex;
    flex-direction: column;
    color: var(--color-on-surface);
    overflow: hidden;
    box-shadow: var(--shadow-sm);
    border-radius: 5px;

    .modal__background {
        position: absolute;
        background-color: var(--color-background);
        z-index: -1;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }

    .modal__content {
        display: flex;
        flex-direction: column;
        padding: 2rem;
        flex: 1;
        max-width: 100%;
        overflow-x: hidden;
        overflow-y: auto;
    }
}

:deep(.modal__content > *) {
    width: 100%;
}
</style>
