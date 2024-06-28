import { LightningElement, wire, track } from 'lwc';
import getProjectsByStatus from '@salesforce/apex/ProjectService.getProjectsByStatus';

export default class ProjectList extends LightningElement {
    
    @track status = 'All';
    @track projects = [];
    @track error;

    statusOptions = [
        { label: 'All', value: 'All' },
        { label: 'Planned', value: 'Planned' },
        { label: 'In Progress', value: 'In Progress' },
        { label: 'Completed', value: 'Completed' }
    ];

    columns = [
        { label: 'Name', fieldName: 'Name' },
        { label: 'Start Date', fieldName: 'Start_Date__c', type: 'date' },
        { label: 'End Date', fieldName: 'End_Date__c', type: 'date' },
        { label: 'Status', fieldName: 'Status__c' },
        { label: 'Description', fieldName: 'Description__c' }
    ];

    connectedCallback() {
        console.log('status', this.status);
        this.fetchProjects(this.status);
    }

    fetchProjects(status) {
        getProjectsByStatus({ status })
            .then(result => {
                this.projects = result;
                this.error = undefined;
            })
            .catch(error => {
                this.error = error;
                this.projects = [];
            });
    }

    handleStatusChange(event) {
        this.status = event.detail.value;
        this.fetchProjects(this.status);
    }

}
