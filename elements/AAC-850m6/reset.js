function(instance, context) {
    const input =
        instance.data.input ||
        document.getElementById(instance.data.inputid);

    if (!input) {
        return;
    }

    const initialDate = instance.data.initialdate
        ? new Date(instance.data.initialdate)
        : null;

    const initialIsValid =
        initialDate !== null &&
        !Number.isNaN(initialDate.getTime());

    if (!initialIsValid) {
        input.value = "";
        instance.data.publishInputValue();
        instance.publishState("valid", input.checkValidity());
        return;
    }

    const pad = function(value) {
        return String(value).padStart(2, "0");
    };

    const dateValue =
        initialDate.getFullYear() + "-" +
        pad(initialDate.getMonth() + 1) + "-" +
        pad(initialDate.getDate());

    const timeValue =
        pad(initialDate.getHours()) + ":" +
        pad(initialDate.getMinutes());

    if (instance.data.format === "date") {
        input.value = dateValue;
    } else if (instance.data.format === "month") {
        input.value = dateValue.slice(0, 7);
    } else if (instance.data.format === "time") {
        input.value = timeValue;
    } else {
        input.value = dateValue + "T" + timeValue;
    }

    instance.data.publishInputValue(initialDate);
    instance.publishState("valid", input.checkValidity());
}
