<template>
    <div
        class="badge"
        :style="{ backgroundColor: color }"
        :class="{ 'text-light': useLightText, 'text-dark': useDarkText }"
    >
        <slot></slot>
    </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
const props = defineProps({
    color: {
        type: String,
        default: 'var(--color-primary)'
    },
    useLightText: {
        type: Boolean,
        default: true
    },
    useDarkText: {
        type: Boolean,
        default: false
    }
});
</script>

<style scoped lang="scss">
.badge {
    display: inline-flex;
    align-items: center;
    padding: 0.4rem 0.8rem;
    border-radius: 99px;
    opacity: 0.8;
    > * {
        white-space: nowrap;
        font-size: 1.2rem;
    }

    &.text-light {
        color: var(--color-surface);
    }
    &.text-dark {
        color: var(--color-on-surface);
    }
}
</style>
