<template>
    <span class="link">
        <slot></slot>
    </span>
</template>

<script setup lang="ts"></script>

<style lang="scss">
span.link {
    display: inline;
    color: var(--color-primary);
    cursor: pointer;
    white-space: nowrap;

    * {
        color: inherit;
    }

    > i {
        margin-right: 0.4rem;
    }
}
</style>
