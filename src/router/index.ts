import ConfirmModal from '@/components/modals/templates/ConfirmModal.vue';
import TheHomePage from '@/components/pages/TheHomePage.vue';
import TheLostPage from '@/components/pages/TheLostPage.vue';
import TheProjectPage from '@/components/pages/TheProjectPage.vue';
import ModalController from '@/controllers/modal-controller';
import { t } from '@/i18n/locale';
import { startTracking, stopTracking } from '@/tracker';
import { RouterOptions, createRouter, createWebHistory } from 'vue-router';

export enum PageName {
    HOME = 'home-page',
    PROJECT = 'project-page',
    LOST = 'lost-page'
}

const routes = [
    {
        path: '/',
        components: {
            page: TheHomePage
        },
        name: PageName.HOME
    },
    {
        path: '/project/:id',
        components: {
            page: TheProjectPage
        },
        name: PageName.PROJECT
    },
    {
        path: '/:pathMatch(.*)*',
        components: {
            page: TheLostPage // 404 page
        },
        name: PageName.LOST
    }
];

const routerOptions = {
    history: createWebHistory(),
    routes
};

export const router = createRouter(routerOptions as RouterOptions);

// router.afterEach(async (to, from) => { });

router.beforeEach(async (to, from, next) => {
    // Only track if the user has allowed it
    let allowTracking: boolean = false;
    if (localStorage.getItem('tracking') === 'true') allowTracking = true;
    // Disable tracking on localhost
    if (window.location.hostname === 'localhost') allowTracking = false;

    if (localStorage.getItem('tracking') === null) {
        // If localStorage is not available, show the tracking prompt to enable tracking
        ModalController.open(ConfirmModal, {
            title: t('UI.Modals.Tracking.title'),
            message: t('UI.Modals.Tracking.message'),
            confirmText: t('UI.Modals.Tracking.Controls.confirm'),
            cancelText: t('UI.Modals.Tracking.Controls.cancel'),
            isConfirmButtonCta: true,
            onConfirm: () => {
                localStorage.setItem('tracking', 'true');
                ModalController.close();
            },
            onCancel: () => {
                localStorage.setItem('tracking', 'false');
                ModalController.close();
            }
        });
    }

    if (allowTracking) startTracking();
    else stopTracking();

    next();
});
