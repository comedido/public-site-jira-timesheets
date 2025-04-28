import { LightningElement, track, wire } from 'lwc';
import { getListUi } from 'lightning/uiListApi';
import PSA_USER_STORY_OBJECT from '@salesforce/schema/PSA_UserStory__c';
import PSA_BOARD_OBJECT from '@salesforce/schema/PSA_Board__c';

export default class PsaTimeSheet extends LightningElement {
    @track timesheetRows = [this.createEmptyRow()];
    selectedDate = this.formatDate(new Date());

    // For projects
    @track allProjects = [];
    @wire(getListUi, { objectApiName: PSA_BOARD_OBJECT, listViewApiName: 'All' })
    wiredBoards({ error, data }) {
        if (data) {
            this.allProjects = data.records.records.map(record => ({
                id: record.id,
                name: record.fields.Name.value
            }));
        } else if (error) {
            console.error('Error fetching boards:', error);
        }
    }

    // For user stories
    @track userStorySuggestions = [];
    @wire(getListUi, { objectApiName: PSA_USER_STORY_OBJECT, listViewApiName: 'All_User_Stories' })
    wiredUserStories({ error, data }) {
        if (data) {
            this.userStorySuggestions = data.records.records.map(record => ({
                id: record.id,
                name: record.fields.Name.value,
                summary: this.truncateText(
                    record.fields.PSA_Summary__c ? record.fields.PSA_Summary__c.value : 'No summary available',
                    30
                ),
                fullSummary: record.fields.PSA_Summary__c ? record.fields.PSA_Summary__c.value : 'No summary available'
            }));
        } else if (error) {
            console.error('Error fetching user stories:', error);
        }
    }

    // Utility method to truncate text
    truncateText(text, maxLength) {
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    }

    // === Row Logic ===
    createEmptyRow() {
        return {
            userStorySuggestions: [],
            selectedUserStories: [],
            showUserStorySuggestions: false,
            id: Date.now() + Math.random(),
            projectName: '',
            showSuggestions: false,
            suggestions: [],
            monday: 0,
            tuesday: 0,
            wednesday: 0,
            thursday: 0,
            friday: 0,
            total: 0
        };
    }

    handleProjectFocus(event) {
        const index = event.target.dataset.index;
        this.timesheetRows[index].suggestions = this.allProjects.map(project => project.name);
        this.timesheetRows[index].showSuggestions = true;
    }

    handleUserStoryFocus(event) {
        const index = event.target.dataset.index;
        this.timesheetRows[index].userStorySuggestions = [...this.userStorySuggestions];
        this.timesheetRows[index].showUserStorySuggestions = true;
    }

    handleProjectChange(event) {
        const index = event.target.dataset.index;
        const value = event.target.value.toLowerCase();

        // Filter project suggestions based on input
        const suggestions = this.allProjects
            .filter(project => project.name.toLowerCase().includes(value))
            .map(project => project.name);

        this.timesheetRows[index].projectName = value;
        this.timesheetRows[index].suggestions = suggestions;
        this.timesheetRows[index].showSuggestions = true;
    }

    handleUserStoryChange(event) {
        const index = event.target.dataset.index;
        const value = event.target.value.toLowerCase();

        // Filter user story suggestions based on input
        const suggestions = this.userStorySuggestions.filter(story =>
            story.name.toLowerCase().includes(value)
        );

        this.timesheetRows[index].userStorySuggestions = suggestions;
        this.timesheetRows[index].showUserStorySuggestions = true;
    }

    selectSuggestion(event) {
        const index = event.currentTarget.dataset.index;
        const value = event.currentTarget.dataset.value;

        this.timesheetRows[index].projectName = value;
        this.timesheetRows[index].showSuggestions = false;
    }

    selectUserStory(event) {
        const index = event.target.dataset.index;
        const storyId = event.target.dataset.id;
        const storyName = event.target.dataset.name;

        // Add the selected user story to the list if not already added
        const selectedStories = this.timesheetRows[index].selectedUserStories;
        if (!selectedStories.some(story => story.id === storyId)) {
            selectedStories.push({ id: storyId, name: storyName });
        }

        // Clear suggestions
        this.timesheetRows[index].userStorySuggestions = [];
        this.timesheetRows[index].showUserStorySuggestions = false;
    }

    removeUserStory(event) {
        const index = event.target.dataset.index;
        const storyId = event.target.dataset.id;

        // Remove the selected user story from the list
        this.timesheetRows[index].selectedUserStories = this.timesheetRows[index].selectedUserStories.filter(
            story => story.id !== storyId
        );
    }

    addRow() {
        const newRow = this.createEmptyRow();
        this.timesheetRows = [...this.timesheetRows, newRow];
    }

    removeRow(event) {
        const index = event.target.dataset.index;
        this.timesheetRows.splice(index, 1);
        this.timesheetRows = [...this.timesheetRows]; // Force re-render
    }

    handleHoursChange(event) {
        const index = event.target.dataset.index;
        const day = event.target.dataset.day;
        const value = parseFloat(event.target.value) || 0;
        this.timesheetRows[index][day] = value;
        this.calculateTotal(index);
    }

    calculateTotal(index) {
        const row = this.timesheetRows[index];
        row.total =
            row.monday +
            row.tuesday +
            row.wednesday +
            row.thursday +
            row.friday;
    }

    // === Week Selector Logic ===
    handleDateChange(event) {
        this.selectedDate = event.target.value;
    }

    previousWeek() {
        const date = new Date(this.selectedDate);
        date.setDate(date.getDate() - 7);
        this.selectedDate = this.formatDate(date);
    }

    nextWeek() {
        const date = new Date(this.selectedDate);
        date.setDate(date.getDate() + 7);
        this.selectedDate = this.formatDate(date);
    }

    formatDate(dateObj) {
        return dateObj.toISOString().split('T')[0];
    }

    // === Actions ===
    saveTimesheet() {
        console.log('Saved Timesheet:', JSON.stringify(this.timesheetRows));
        alert('Timesheet saved (mock).');
    }

    submitTimesheet() {
        console.log('Submitted Timesheet:', JSON.stringify(this.timesheetRows));
        alert('Timesheet submitted (mock).');
    }
}