<template>
    <div class="page page--lost">
        <h1>404</h1>
        <p>This page does not exist.</p>
        <button class="btn btn--alt" @click="onClickGoHome()">
            Return to Home Page
        </button>
    </div>
</template>

<script setup lang="ts">
import { PageName, router } from '@/router';

function onClickGoHome() {
    router.push({ name: PageName.HOME });
}
</script>

<style lang="scss" scoped></style>
