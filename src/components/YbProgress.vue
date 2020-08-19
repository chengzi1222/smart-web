<template>
    <div class="mask">
        <div class="progress">
            <slot></slot>
        </div>
    </div>
</template>

<script>
export default {
  
}
</script>

<style lang="scss" scoped>
    .mask{
        position: fixed;
        z-index: 999;
        background: rgba(0, 0, 0, .2);
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        .progress{
            position: fixed;
            left: 50%;
            top: 50%;
            transform: translate(-50%,-50%);
        }
    }
</style>
