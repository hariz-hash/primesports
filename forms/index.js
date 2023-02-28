// import in caolan forms
const forms = require("forms");
const widgets = forms.widgets;

// create some shortcuts
const fields = forms.fields;
const validators = forms.validators;

var bootstrapField = function (name, object) {
    if (!Array.isArray(object.widget.classes)) { object.widget.classes = []; }

    if (object.widget.classes.indexOf('form-control') === -1) {
        object.widget.classes.push('form-control');
    }

    var validationclass = object.value && !object.error ? 'is-valid' : '';
    validationclass = object.error ? 'is-invalid' : validationclass;
    if (validationclass) {
        object.widget.classes.push(validationclass);
    }

    var label = object.labelHTML(name);
    var error = object.error ? '<div class="invalid-feedback">' + object.error + '</div>' : '';

    var widget = object.widget.toHTML(name, object);
    return '<div class="form-group">' + label + widget + error + '</div>';
};

const createProductForm = (brands, genders, colors, size, materials = []) => { // add materials
    return forms.create({
        'model': fields.string({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            validators: [validators.maxlength(100)]
        }),
        'description': fields.string({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            validators: [validators.maxlength(200)]
        }),
        'shoe_type': fields.string({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            validators: [validators.maxlength(200)]
        }),
        'brand_id': fields.string({
            label: 'Brands',
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            widget: widgets.select(),
            choices: brands
        }),
        'gender_id': fields.string({
            label: 'Gender',
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            widget: widgets.select(),
            choices: genders
        }),
        'materials': fields.string({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            widget: widgets.multipleSelect(),
            choices: materials
        }),

        'image_url': fields.string({
            required: validators.required('Image required'),
            required: false,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            widget: widgets.hidden()
        }),
        'thumbnail_url': fields.string({
            required: false,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            widget: widgets.hidden()
        }),

        //new entry
        'cost': fields.number({
            label: 'Cost',
            required: true,
            errorAfterField: true,
            validators: [validators.integer(), validators.min(0)]
        }),
        'stock': fields.number({
            label: 'Stock',
            required: true,
            errorAfterField: true,
            validators: [validators.integer(), validators.min(0)]
        }),
        'color_id': fields.string({
            label: 'Color',
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            widget: widgets.select(),
            choices: colors
        }),
        'size_id': fields.string({
            label: 'size',
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            widget: widgets.select(),
            choices: size
        }),
    })
};


module.exports = { createProductForm, bootstrapField };