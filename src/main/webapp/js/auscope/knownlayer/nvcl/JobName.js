/**
 * NVCL Job Names using borehole id are a representation of a job name/job id response from the NVCL data service
 */
Ext.define('auscope.knownlayer.nvcl.JobName', {
    extend: 'Ext.data.Model',

    fields : [
        {name : 'boreholeId', type: 'string'},
        {name : 'jobName', type: 'string'},
        {name : 'jobId', type: 'string'}
    ]
});