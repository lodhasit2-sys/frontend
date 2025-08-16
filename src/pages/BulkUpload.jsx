import React from 'react'

export default function BulkUpload() {
  return (
    <div style={{ padding: 16 }}>
      <h2>Bulk Upload</h2>
      <p>Templates:</p>
      <ul>
        <li><a href="/templates/bulk_projects_template.csv" download>Projects CSV Template</a></li>
        <li><a href="/templates/bulk_payments_template.csv" download>Payments CSV Template</a></li>
        <li><a href="/templates/bulk_documents_template.csv" download>Documents CSV Template</a></li>
      </ul>
      <p>Upload flows can be added here later (mapping columns, preview, import).</p>
    </div>
  )
}