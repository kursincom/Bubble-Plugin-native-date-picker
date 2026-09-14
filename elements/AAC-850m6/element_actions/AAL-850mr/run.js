function(instance, properties, context) {
    const input =
        instance.data.input ||
        document.getElementById(instance.data.inputid);

    if (!input) {
        return;
    }

    const date = properties.date
        ? new Date(properties.date)
        : null;

    if (!date || Number.isNaN(date.getTime())) {
        input.value = "";
        instance.data.publishInputValue();
        instance.publishState("valid", input.checkValidity());
        return;
    }

    const pad = function(value) {
        return String(value).padStart(2, "0");
    };

    const dateValue =
        date.getFullYear() + "-" +
        pad(date.getMonth() + 1) + "-" +
        pad(date.getDate());

    const timeValue =
        pad(date.getHours()) + ":" +
        pad(date.getMinutes());

    if (instance.data.format === "date") {
        input.value = dateValue;
    } else if (instance.data.format === "month") {
        input.value = dateValue.slice(0, 7);
    } else if (instance.data.format === "time") {
        input.value = timeValue;
    } else {
        input.value = dateValue + "T" + timeValue;
    }

    instance.data.publishInputValue(date);
    instance.publishState("valid", input.checkValidity());

    if (properties.triggerevent === true) {
        instance.triggerEvent("dateready");
    }
}
