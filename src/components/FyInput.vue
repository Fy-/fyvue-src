<template>
    <div class="input-group" v-if="validate">
        <div class="" v-if="showLabel">
            <label class="label-basic" :for="id"
                >{{ label }} <sup class="text-red-700" v-if="req">*</sup>
                <a
                    :href="labelHelp"
                    target="_blank"
                    @click="labelHelp()"
                    v-if="hasLabelHelp"
                >
                    <QuestionMarkCircleIcon class="help-icon"
                /></a>
            </label>
        </div>
        <div class="flex-1">
            <div
                class="input-box"
                :class="{ 'error-form': validate.$errors.length }"
            >
                <input
                    class="input-basic"
                    :type="type"
                    :placeholder="placeholder"
                    v-model="validate.$model"
                    :autocomplete="autocomplete"
                    :id="id"
                    v-if="
                        type == 'text' || type == 'password' || type == 'email'
                    "
                />
                <textarea
                    v-if="type == 'textarea'"
                    class="input-basic h-32"
                    :placeholder="placeholder"
                    v-model="validate.$model"
                    :autocomplete="autocomplete"
                    :id="id"
                ></textarea>
                <select
                    v-if="type == 'select'"
                    id="id"
                    class="input-basic"
                    v-model="validate.$model"
                >
                    <option
                        v-for="opt in options"
                        :value="opt[0]"
                        v-bind:key="opt[0]"
                    >
                        {{ opt[1] }}
                    </option>
                </select>
                <slot name="icon"> </slot>
            </div>
            <slot name="adds"> </slot>
            <div class="help-text" v-if="help">
                {{ help }}
            </div>
            <div
                class="form-error-label"
                v-if="
                    validate.$errors.length > 0 &&
                    validate.$errors[0].$validator
                "
            >
                {{ $t(snakeCase(`errorForm` + validate.$errors[0].$message)) }}
            </div>
        </div>
    </div>
</template>
<script>
import { QuestionMarkCircleIcon } from "@heroicons/vue/24/solid";

export default {
    name: "FyInput",
    components: {
        QuestionMarkCircleIcon,
    },
    props: {
        req: {
            type: Boolean,
            default: false,
        },
        hasLabelHelp: {
            type: Boolean,
            default: false,
        },
        options: {
            type: Array,
            default: [],
        },
        labelHelp: String,
        showLabel: Boolean,
        validate: Object,
        label: String,
        help: String,
        placeholder: String,
        autocomplete: {
            type: String,
            default: "",
        },
        id: String,
        type: {
            type: String,
            default: "text",
        },
    },
    methods: {
        snakeCase: (str) => {
            return str
                .replace(/\W+/g, " ")
                .split(/ |\B(?=[A-Z])/)
                .map((word) => word.toLowerCase())
                .join("_");
        },
    },
};
</script>
