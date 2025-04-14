<template>
    <div class="panel">
        <slot></slot>
    </div>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
.panel {
    padding: 2rem;
    border-radius: 5px;
    background-color: var(--color-background);
    border: 1px solid var(--color-surface-alt);
    overflow-y: auto;
    overflow-x: hidden;
    display: flex;
    flex-direction: column;
    align-items: start;
    gap: 0.8rem;
    box-shadow: var(--shadow-sm);
}
</style>
