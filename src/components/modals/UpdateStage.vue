<template>
  <div
    class="modal fade"
    id="updateStage"
    tabindex="-1"
    aria-labelledby="updateStageLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="updateStageLabel">Edit Board Title</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <form action="">
            <div class="stageTitile d-flex align-content-center gap-4">
              <div class="">
                <span>Stage Title</span>
                <span class="text-danger">*</span>
              </div>
              <input type="text" name="title" id="title" />
            </div>
            <div class="stageColor d-flex align-items-center gap-4 mt-3">
              <div class="">
                <span>Stage Color</span>
                <span class="text-danger">*</span>
              </div>
              <input type="color" name="color" id="color" />
            </div>
          </form>
        </div>
        <div
          class="modal-footer d-flex justify-content-between align-items-center"
        >
          <button type="button" class="btn btn-primary">Update</button>
          <button type="button" class="btn btn-primary">Delete Stage</button>
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "updateStage",
  setup() {
    return {};
  },
};
</script>
