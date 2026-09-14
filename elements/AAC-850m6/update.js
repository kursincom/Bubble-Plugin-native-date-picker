function(instance, properties, context) {
    const fontParts = properties.bubble.font_face().split(":");

    instance.data.fontsize = properties.bubble.font_size() + "px";
    instance.data.fontface = fontParts[0];
    instance.data.fontweight = fontParts[3];
    instance.data.borderwidth = properties.bubble.border_width() + "px";
    instance.data.borderstyle = properties.bubble.border_style();

    instance.data.required = properties.required === true;
    instance.data.fitwidthtocontent = properties.fitwidth === true;
    instance.data.fitheighttocontent = properties.fitheight === true;
    instance.data.vcenter = properties.vcenter === true;
    instance.data.colorscheme = properties.colorscheme || "normal";
    instance.data.step =
        properties.step === null || properties.step === undefined
            ? ""
            : String(properties.step);
    instance.data.min = properties.min || "";
    instance.data.max = properties.max || "";

    if (properties.format === "date") {
        instance.data.format = "date";
    } else if (properties.format === "time") {
        instance.data.format = "time";
    } else if (
        properties.format === "month" ||
        properties.format === "month (see info)"
    ) {
        instance.data.format = "month";
    } else {
        instance.data.format = "datetime-local";
    }

    const input = instance.data.input ||
        document.getElementById(instance.data.inputid);

    if (!input) {
        return;
    }

    input.type = instance.data.format;
    input.required = instance.data.required;
    input.step = instance.data.step;
    input.min = instance.data.min;
    input.max = instance.data.max;
    input.style.colorScheme = instance.data.colorscheme;

    const canvas = instance.canvas;
    canvas.css(
        "width",
        instance.data.fitwidthtocontent
            ? "max-content"
            : "100%"
    );
    canvas.css(
        "height",
        instance.data.fitheighttocontent
            ? "max-content"
            : "100%"
    );
    canvas.css(
        "display",
        instance.data.vcenter ? "flex" : ""
    );
    canvas.css(
        "justifyContent",
        instance.data.vcenter ? "center" : ""
    );
    canvas.css(
        "alignItems",
        instance.data.vcenter ? "center" : ""
    );

    const initialDate = properties.initial
        ? new Date(properties.initial)
        : null;
    const initialIsValid =
        initialDate !== null &&
        !Number.isNaN(initialDate.getTime());
    const initialKey = initialIsValid
        ? instance.data.format + ":" + initialDate.getTime()
        : instance.data.format + ":empty";
    const initialChanged =
        instance.data.initialKey !== initialKey;

    instance.data.initialdate = initialIsValid
        ? properties.initial
        : null;

    if (initialChanged) {
        if (!initialIsValid) {
            input.value = "";
        } else {
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
        }

        instance.data.publishInputValue(
            initialIsValid ? initialDate : undefined
        );

        if (document.activeElement === input) {
            instance.data.valueOnFocus = input.value;
        }
    }

    instance.data.initialKey = initialKey;
    instance.publishState("valid", input.checkValidity());
}
