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

    * {
        color: inherit;
    }

    > i {
        margin-right: 0.4rem;
    }
}
</style>
