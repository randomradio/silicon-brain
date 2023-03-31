<template>
    <div class="modal" v-if="isOpen">
      <div class="modal-overlay"></div>
      <div class="modal-content">
        <slot></slot>
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent } from "vue";
  
  export default defineComponent({
    name: "Modal",
    props: {
      isOpen: {
        type: Boolean,
        required: true,
      },
    },
    emits: ["save", "cancel"],
    methods: {},
  });
  </script>
  
  <style lang="scss" scoped>
  .modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .modal-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
  }
  
  .modal-content {
    position: relative;
    background-color: #fff;
    padding: 2rem;
    border-radius: 5px;
    z-index: 10;
    max-width: 80%;
  }
  
  .modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    margin-top: 1rem;
  }
  </style>
  