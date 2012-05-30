/* jsjobs */
/* Copyright 2012 Paras Jain, parasjain.com */
/* Jobs are queued work for the VM to handle asynchronously, ideal for contacting a server with updates, refreshing page content, etc. */

/* How to use:

Initialize job manager on start:
window.jobsObj = new Jobs();

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
	this.jobFunc = {};
	this.jobFuncIn = {};
};

Jobs.prototype.addJob = function(jobFuncIn, jobname, timeout) {
	var jobid = (window.jobsObj.size(this.jobslist)) + "" + new Date().getTime(); // Append job create time to jobid
	if (jobname !== undefined) {
		jobid = jobname;
	}
	this.jobFuncIn[jobid] = jobFuncIn;
	if (timeout == 0) {
		this.jobFunc[jobid] = function() {
			var returnVal = jobFuncIn();
			setTimeout(this.jobFunc[jobid], 1000);
			return returnVal;
		};
	} else {
		this.jobFunc[jobid] = jobFuncIn;
	}
	this.jobslist[jobid] = this.jobFunc[jobid];
	console.log("Added job " + jobid + " with object function: " + this.jobFunc[jobid]);
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

Jobs.prototype.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

Jobs.prototype.merge = function(obj1,obj2) {
    var obj3 = {};
    for (var attrname in obj1) { obj3[attrname] = obj1[attrname]; }
    for (var attrname in obj2) { obj3[attrname] = obj2[attrname]; }
    return obj3;
};

// Jobs Daemon, default refresh of 100ms
function jobsd(){
	var jobs = window.jobsObj.jobslist;
	if (window.jobsObj.size(jobs) > 0) { // check if jobs is empty
		var jobid;
		var jobs_return = {};
		var job_func;
		for (jobid in jobs) {
			job_func = jobs[jobid];
			console.log("Job ID " + jobid);
			jobs_return[jobid] = job_func();
		}
		for (jobid in jobs_return) {
			console.log("Job ID " + jobid + " returned ");
			console.log(jobs_return[jobid]);
		}

		//console.log(window.funcs);
		window.jobsObj.resultSet = window.jobsObj.merge(window.jobsObj.resultSet, jobs_return);

		window.jobsObj.jobslist = {};
		jobs = {};
		jobs_return = {};
	}
	setTimeout(jobsd, 100); // Run jqmb_jobs 100ms later
};