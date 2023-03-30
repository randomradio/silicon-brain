<template>
    <div class="settings">
      <div class="input-group field is-horizontal">
        <div class="field-label is-normal">
          <label for="openai_api_key" class="label">OpenAI API Key</label>
        </div>
        <div class="field-body">
          <div class="field">
            <div class="control">
              <input class="input"  type="text" id="openai_api_key" v-model="localSettings.openai_api_key" />
            </div>
          </div>
        </div>
      </div>
  
      <div class="input-group field is-horizontal">
        <div class="field-label is-normal">
          <label for="model" class="label">Model</label>
        </div>
        <div class="field-body">
          <div class="field">
            <div class="control">
              <input class="input"  type="text" id="model" v-model="localSettings.model" />
            </div>
          </div>
        </div>
      </div>
  
      <div class="input-group field is-horizontal">
        <div class="field-label is-normal">
          <label for="nightshift" class="label">Night Shift</label>
        </div>
        <div class="field-body">
          <div class="field">
            <div class="control">
              <input class="input"  type="checkbox" id="nightshift" v-model="localSettings.nightshift" />
            </div>
          </div>
        </div>
      </div>
  
      <div class="input-group field is-horizontal">
        <div class="field-label is-normal">
          <label for="max_token_count" class="label">Max Token Count</label>
        </div>
        <div class="field-body">
          <div class="field">
            <div class="control">
              <input class="input"  type="number" id="max_token_count" v-model="localSettings.max_token_count" />
            </div>
          </div>
        </div>
      </div>
  
      <div class="button-group field is-grouped is-grouped-right">
        <div class="control">
          <button @click="save" class="button is-primary">Save</button>
        </div>
        <div class="control">
          <button @click="$emit('close')" class="button is-light">Cancel</button>
        </div>
      </div>
    </div>
  </template>

  <script lang="ts">
  import { defineComponent, ref, watch } from "vue";
  import { UserSettings } from "../misc/storage";
  
  export default defineComponent({
    name: "Settings",
    props: {
      settings: {
        type: Object as () => UserSettings,
        required: true,
      },
    },
    emits: ['update-settings', 'close'],
    setup(props, { emit }) {
      const localSettings = ref<UserSettings>({ ...props.settings });
  
      watch(props.settings, () => {
        localSettings.value = { ...props.settings };
      });
  
      const save = () => {
        emit("update-settings", localSettings.value);
        emit("close");
      };
  
      return {
        localSettings,
        save,
      };
    },
  });
  </script>
  
  <style lang="scss" scoped>
  .input-group {
    margin-bottom: 1rem;
  }
  
  .button-group {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
  }
  </style>
  