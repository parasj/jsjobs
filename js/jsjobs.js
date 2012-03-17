/* JavaScript Job Manager */
/* Copyright 2012 Paras Jain, parasjain.com */
/* Jobs are queued work for the VM to handle with the jqmb jobs class being called relatively frequently */

/* How to use:

Initialize job manager on start:
window.jobsObj = new Jobs(); jobsd();

Add a job to the window.jobsObj object, like
window.jobsObj.addJob(function() { return true; });

*/

/* TODO:

Add in job priorities
Constant jobs (e.g. update from server)
Callbacks when job is completed

*/

// Jobs constructor
function Jobs() {
	this.jobslist = {};
	this.resultSet = {};
};

Jobs.prototype.addJob = function(jobFunc, jobname) {
	var jobid = (window.funcs.size(this.jobslist)) + "" + new Date().getTime(); // Append job create time to jobid
	if (jobname !== undefined) {
		jobid = jobname;
	}
	this.jobslist[jobid] = jobFunc;
	console.log("Added job " + jobid + " with object function: " + jobFunc);
	return jobid;
};

Jobs.prototype.deleteJob = function(jobid) {
	this.jobslist[jobid] = function () { return null; }; // replace previous job with empty function
	console.log("Removed job " + jobid);
	return true;
};

Jobs.prototype.GetJobsObj = function() {
	return this.jobslist;
};

Jobs.prototype.getResultByID = function(resultID) {
	return this.resultSet[resultID];
};

Jobs.prototype.getResultSet = function() {
	return this.resultSet;
};

// Jobs Daemon, default refresh of 100ms
function jobsd(){
	var jobs = window.jobsObj.jobslist;
	if (window.funcs.size(jobs) > 0) { // check if jobs is empty
		var jobid;
		var jobs_return = {};
		var job_func;
		for (jobid in jobs) {
			job_func = jobs[jobid];
			console.log("Job ID " + jobid + " is: " + job_func);
			jobs_return[jobid] = job_func();
		}
		for (jobid in jobs_return) {
			console.log("Job ID " + jobid + " returned ");
			console.log(jobs_return[jobid]);
		}

		//console.log(window.funcs);
		window.jobsObj.resultSet = window.funcs.merge(window.jobsObj.resultSet, jobs_return);

		window.jobsObj.jobslist = {};
		jobs = {};
		jobs_return = {};
	}
	setTimeout(jobsd, 100); // Run jqmb_jobs 100ms later
};