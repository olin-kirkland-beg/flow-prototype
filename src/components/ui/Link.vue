<template>
    <span class="link">
        <slot></slot>
    </span>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
span.link {
    display: inline;
    color: var(--color-primary);
    cursor: pointer;
}
</style>
