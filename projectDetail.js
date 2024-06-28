import { LightningElement, api, track, wire } from 'lwc';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
// import { updateRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent'; // Ensure correct import statement
import updateProject from '@salesforce/apex/ProjectService.updateProject';
const FIELDS = [
    'Project__c.Name',
    'Project__c.Status__c',
    'Project__c.Start_Date__c',
    'Project__c.End_Date__c',
    'Project__c.Description__c'
    // Add more fields as needed
];


export default class ProjectDetail extends LightningElement {
    @api project;
    @track statusOptions = [
        { label: 'Planned', value: 'Planned' },
        { label: 'In Progress', value: 'In Progress' },
        { label: 'Completed', value: 'Completed' }
    ];

    @wire(getRecord, { recordId: '$project', fields: FIELDS })
    wiredProject({ error, data }) {
        if (data) {
            console.log('data', data);
            this.project = data;
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.project = undefined;
        }
    }
    get projectName() {
        return this.project ? getFieldValue(this.project, 'Project__c.Name') : '';
    }
    get projectStartDate() {
        return this.project ? getFieldValue(this.project, 'Project__c.Start_Date__c') : '';
    }
    get projectEndDate() {
        return this.project ? getFieldValue(this.project, 'Project__c.End_Date__c') : '';
    }
    get projectDescription() {
        return this.project ? getFieldValue(this.project, 'Project__c.Description__c') : '';
    }

    get projectStatus() {
        return this.project ? getFieldValue(this.project, 'Project__c.Status__c') : '';
    }


    handleInputChange(event) {
        const field = event.target.dataset.id;
        console.log('field', field);
        this.project = { ...this.project, [field]: event.target.value };
        console.log('project', this.project);
    }

    // handleSave() {
    //     console.log('projectId:', this.project.id);
    //     console.log('projectName:', this.project.Name);
    //     console.log('description:', this.project.Description__c);



    //     updateProject({
    //         projectId: this.project.id,
    //         projectName: this.project.Name,
    //         description: this.project.Description__c,
    //         startDate: this.project.Start_Date__c,
    //         endDate: this.project.End_Date__c,
    //         status: this.project.Status__c
    //     })
    //         .then(result => {
    //             const saveEvent = new CustomEvent('projectsave', { detail: result });
    //             this.dispatchEvent(saveEvent);
    //         })
    //         .catch(error => {
    //             console.error(error);
    //         });
    // }
    handleSave() {
        console.log('click');
        const fields = {};
        fields['Id'] = this.project.id;
        console.log("fields['Id']", fields['Id']);
        fields['Name'] = this.template.querySelector("[data-id='Name']").value;
        console.log("fields['Name']", fields['Name']);
        fields['Start_Date__c'] = this.template.querySelector("[data-id='Start_Date__c']").value;
        fields['End_Date__c'] = this.template.querySelector("[data-id='End_Date__c']").value;
        fields['Status__c'] = this.template.querySelector("[data-id='Status__c']").value;
        fields['Description__c'] = this.template.querySelector("[data-id='Description__c']").value;
        console.log("fields['Description__c']", fields['Description__c']);



        
        updateProject({ projectId: this.project.id, projectName: fields['Name'], startDate: fields['Start_Date__c'], endDate: fields['End_Date__c'], projectStatus: fields['Status__c'], description: fields['Description__c'] })
            .then(result => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Project updated successfully',
                        variant: 'success',
                    })
                );
                // Optionally, refresh any related components or data
                this.dispatchEvent(new CustomEvent('projectsave'));
            })
            .catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error updating record',
                        message: error.body.message,
                        variant: 'error',
                    })
                );
            });
    }
}
