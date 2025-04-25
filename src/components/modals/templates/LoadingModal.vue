<template>
    <ModalFrame>
        <template v-slot:content>
            <div class="loader">
                <i class="fas fa-spinner fa-spin"></i>
            </div>
        </template>
    </ModalFrame>
</template>

<script setup lang="ts">
import ModalFrame from '@/components/modals/ModalFrame.vue';
</script>

<style scoped lang="scss">
.loader > i {
    font-size: 2rem;
}
</style>
