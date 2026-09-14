function(instance, context) {
    instance.publishState("is_focused", false);

    instance.data.inputid =
        "datetimeinput" + Math.floor(Math.random() * 1000000).toString();
    instance.data.valueOnFocus = "";
    instance.data.initialKey = null;

    const input = document.createElement("input");
    input.id = instance.data.inputid;
    input.type = "datetime-local";

    input.style.borderWidth = "0";
    input.style.padding = "0";
    input.style.margin = "0";
    input.style.fontSize = "inherit";
    input.style.fontFamily = "inherit";
    input.style.fontWeight = "inherit";
    input.style.backgroundColor = "rgba(255, 255, 255, 0.01)";
    input.style.color = "inherit";
    input.style.fontStyle = "inherit";
    input.style.textDecoration = "inherit";
    input.style.textAlign = "inherit";

    instance.canvas[0].appendChild(input);
    instance.data.input = input;

    instance.data.publishInputValue = function(referenceDate) {
        const value = input.value;

        if (!value) {
            instance.publishState("date");
            instance.publishState("date_string", "");
            return;
        }

        const parts = value.split(/[-T:]/).map(Number);
        let dateValue;

        if (instance.data.format === "date") {
            dateValue = new Date(
                parts[0],
                parts[1] - 1,
                parts[2]
            );
        } else if (instance.data.format === "month") {
            dateValue = new Date(
                parts[0],
                parts[1] - 1,
                1
            );
        } else if (instance.data.format === "time") {
            dateValue = referenceDate
                ? new Date(referenceDate.getTime())
                : new Date();

            dateValue.setHours(
                parts[0],
                parts[1] || 0,
                parts[2] || 0,
                0
            );
        } else {
            dateValue = new Date(
                parts[0],
                parts[1] - 1,
                parts[2],
                parts[3] || 0,
                parts[4] || 0,
                parts[5] || 0,
                0
            );
        }

        if (Number.isNaN(dateValue.getTime())) {
            instance.publishState("date");
        } else {
            instance.publishState("date", dateValue);
        }

        instance.publishState("date_string", value);
    };

    input.addEventListener("focus", function() {
        instance.data.valueOnFocus = this.value;

        instance.publishState("is_focused", true);
        instance.triggerEvent("focused");
    });

    input.addEventListener("blur", function() {
        const valueChanged =
            this.value !== instance.data.valueOnFocus;
        const isValid = this.checkValidity();

        instance.publishState("is_focused", false);
        instance.publishState("valid", isValid);

        if (valueChanged) {
            instance.triggerEvent("value_changed");
        }

        if (!isValid) {
            instance.triggerEvent("invalid");
        }

        instance.triggerEvent("blurred");
    });

    input.addEventListener("input", function() {
        instance.data.publishInputValue();
        instance.publishState("valid", this.checkValidity());

        if (!this.value) {
            instance.triggerEvent("reset");
            return;
        }

        instance.triggerEvent("dateready");
    });
}