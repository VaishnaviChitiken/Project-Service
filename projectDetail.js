import { LightningElement, api, track } from 'lwc';
import updateProject from '@salesforce/apex/ProjectService.updateProject';

export default class ProjectDetail extends LightningElement {
    @api project;
    @track statusOptions = [
        { label: 'Planned', value: 'Planned' },
        { label: 'In Progress', value: 'In Progress' },
        { label: 'Completed', value: 'Completed' }
    ];

    handleInputChange(event) {
        const field = event.target.dataset.id;
        this.project = { ...this.project, [field]: event.target.value };
    }

    handleSave() {
        updateProject({
            projectId: this.project.Id,
            projectName: this.project.Name,
            description: this.project.Description__c,
            startDate: this.project.Start_Date__c,
            endDate: this.project.End_Date__c,
            status: this.project.Status__c
        })
        .then(result => {
            const saveEvent = new CustomEvent('projectsave', { detail: result });
            this.dispatchEvent(saveEvent);
        })
        .catch(error => {
            console.error(error);
        });
    }
}
