<script>
  import StringRenderer from "./StringRenderer.svelte"
  import BooleanRenderer from "./BooleanRenderer.svelte"
  import DateTimeRenderer from "./DateTimeRenderer.svelte"
  import RelationshipRenderer from "./RelationshipRenderer.svelte"
  import AttachmentRenderer from "./AttachmentRenderer.svelte"
  import ArrayRenderer from "./ArrayRenderer.svelte"
  import InternalRenderer from "./InternalRenderer.svelte"
  import { processStringSync } from "@budibase/string-templates"

  export let row
  export let schema
  export let value
  export let customRenderers = []

  let renderer
  const typeMap = {
    boolean: BooleanRenderer,
    datetime: DateTimeRenderer,
    link: RelationshipRenderer,
    attachment: AttachmentRenderer,
    string: StringRenderer,
    options: StringRenderer,
    number: StringRenderer,
    longform: StringRenderer,
    array: ArrayRenderer,
    internal: InternalRenderer,
  }
  $: type = schema?.type ?? "string"
  $: customRenderer = customRenderers?.find(x => x.column === schema?.name)
  $: renderer = customRenderer?.component ?? typeMap[type] ?? StringRenderer
  $: width = schema?.width || "150px"
  $: cellValue = getCellValue(value, schema.template)

  const getCellValue = (value, template) => {
    if (!template) {
      return value
    }
    return processStringSync(template, { value })
  }
</script>

{#if renderer && (customRenderer || (cellValue != null && cellValue !== ""))}
  <div style="--max-cell-width: {schema.width ? 'none' : '200px'};">
    <svelte:component
      this={renderer}
      {row}
      {schema}
      value={cellValue}
      on:clickrelationship
    >
      <slot />
    </svelte:component>
  </div>
{/if}

<style>
  div {
    display: contents;
  }
</style>
