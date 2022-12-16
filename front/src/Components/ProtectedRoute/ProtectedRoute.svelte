<script lang="ts">
    import { Route, navigate } from "svelte-routing";
    import { authApi } from "../../api/authApi";
    import { onDestroy, onMount, type ComponentType } from "svelte";
    import { userSession } from "../../Stores/UserSessionStore";
    import RequireLogin from "../RequireLogin/RequireLogin.svelte";
    import { get } from "svelte/store";
    export let path: string;
    export let component: ComponentType;

    const unsubscribe = userSession.subscribe(async (value) => {
        if (value === null) {
            // console.log("currentUser.subscribe value", value);
            try {
                const result = await authApi.getLoginUser();

                // console.log(
                //     "currentUser.subscribe getLoginUser result",
                //     result
                // );

                if (!result.success) {
                    // console.log("navigate to login");
                }
            } catch (error) {}
        }
    });

    onMount(async () => {
        if (get(userSession) === null) {
            try {
                const result = await authApi.getLoginUser();

                // console.log(
                //     "currentUser.subscribe getLoginUser result",
                //     result
                // );

                if (!result.success) {
                    // console.log("navigate to login");
                }
            } catch (error) {}
        }
    });

    onDestroy(unsubscribe);
</script>

{#if $userSession}
    <Route {path} {component} />
{:else}
    <Route {path} component={RequireLogin} />
{/if}
