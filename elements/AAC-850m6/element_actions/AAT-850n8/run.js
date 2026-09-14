function(instance, properties, context) {
    const input =
        instance.data.input ||
        document.getElementById(instance.data.inputid);

    if (!input) {
        return;
    }

    input.value = "";
    instance.data.publishInputValue();
    instance.publishState("valid", input.checkValidity());
    instance.triggerEvent("reset");
}
