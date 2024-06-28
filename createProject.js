import { LightningElement, track } from 'lwc';
import createProject from '@salesforce/apex/ProjectService.createProject';

export default class CreateProject extends LightningElement {
    @track name = '';
    @track startDate = '';
    @track endDate = '';
    @track status = '';
    @track description = '';

    get statusOptions() {
        return [
            { label: 'Planned', value: 'Planned' },
            { label: 'In Progress', value: 'In Progress' },
            { label: 'Completed', value: 'Completed' }
        ];
    }

    handleInputChange(event) {
        const field = event.target.dataset.id;
        if (field) {
            this[field] = event.target.value;
        }
    }

    async createProject() {
        if (this.validateInputs()) {
            try {
                const result = await createProject({
                    name: this.name,
                    startDate: this.startDate,
                    endDate: this.endDate,
                    status: this.status,
                    description: this.description
                });
                // Handle success (e.g., show a success message, clear the form)
                this.clearForm();
                this.showToast('Success', 'Project created successfully', 'success');
            } catch (error) {
                // Handle error (e.g., show an error message)
                this.showToast('Error', error.body.message, 'error');
            }
        } else {
            this.showToast('Error', 'Please fill in all required fields correctly.', 'error');
        }
    }

    validateInputs() {
        const allValid = [...this.template.querySelectorAll('lightning-input, lightning-combobox')]
            .reduce((validSoFar, inputCmp) => {
                inputCmp.reportValidity();
                return validSoFar && inputCmp.checkValidity();
            }, true);
        if (allValid && this.startDate <= this.endDate) {
            return true;
        } else {
            if (this.startDate > this.endDate) {
                this.showToast('Error', 'End Date must be greater than or equal to Start Date.', 'error');
            }
            return false;
        }
    }

    clearForm() {
        this.name = '';
        this.startDate = '';
        this.endDate = '';
        this.status = '';
        this.description = '';
    }

    showToast(title, message, variant) {
        const event = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant
        });
        this.dispatchEvent(event);
    }
}
