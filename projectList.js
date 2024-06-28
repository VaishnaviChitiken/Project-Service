import { LightningElement, wire, track } from 'lwc';
import getProjectsByStatus from '@salesforce/apex/ProjectService.getProjectsByStatus';
import { NavigationMixin } from 'lightning/navigation';


export default class ProjectList extends NavigationMixin(LightningElement) {
    
    @track status = 'All';
    @track projects = [];
    @track error;
    @track selectedProject;

    statusOptions = [
        { label: 'All', value: 'All' },
        { label: 'Planned', value: 'Planned' },
        { label: 'In Progress', value: 'In Progress' },
        { label: 'Completed', value: 'Completed' }
    ];

    columns = [
        // { label: 'Name', fieldName: 'Name', type: 'text' },

        { label: 'Name', fieldName: 'Name', type: 'button', typeAttributes: { label: { fieldName: 'Name' } } },
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

    handleRowAction(event) {
        // const actionName = event.detail.action.name;
        // console.log('actionName', actionName);
        const row = event.detail.row.Id;
        console.log('row', row);
        this.selectedProject = row;
        console.log('selectedProjectId', this.selectedProject);
    }
    handleProjectSave(event) {
        this.selectedProject = null;
        this.fetchProjects();
    }

    // navigateToDetail(projectId) {
    //     this[NavigationMixin.Navigate]({
    //         type: 'standard__recordPage',
    //         attributes: {
    //             recordId: projectId,
    //             objectApiName: 'Project__c',
    //             actionName: 'view'
    //         }
    //     });
    // }
    // 
}
