<template>
  <div class="modal-body">
    <div class="row">
      <div class="col-12">
        <div class="mb-3">
          <label for="file" class="form-label">File</label>
          <input type="file" class="form-control" id="file" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "DealForm",
  props: ["file"],
};
</script>
