import { Component, OnInit, Input, Inject, AfterViewInit } from '@angular/core';
import { jsPDF } from "jspdf";
import html2canvas from 'html2canvas';
import { DOCUMENT } from '@angular/common';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
declare var $: any;
import * as printJS from "print-js";

@Component({
  selector: 'barcode',
  templateUrl: './barcode.component.html',
  styleUrls: ['./barcode.component.scss']
})
export class BarcodeComponent implements OnInit, AfterViewInit {

  loading: boolean = false;
  barcodes: any[] = [];
  todayDate: Date = new Date();

  constructor(@Inject(DOCUMENT) private document: Document,
    @Inject(MAT_DIALOG_DATA) private data: any,
  ) {
    this.barcodes = this.data.barcodes || [];
  }

  ngOnInit(): void {

    //this.printScreen();
  }

  ngAfterViewInit(): void
  {
    this.printLalesUsingPrintJs();
  }

  printLalesUsingPrintJs() {

    this.barcodes.forEach((item) => {
      printJS({
        printable: 'list_' + item.code,
        type: 'html',
        css: 'height:3cm; width:5cm;',
        targetStyles: ['*'],
        header: ``
      })
    });
  }

  printScreen() {
    this.loading = true;

    const htmlWidth = $("#print-section").width();
    const htmlHeight = $("#print-section").height();

    const topLeftMargin = 15;

    let pdfWidth = htmlWidth + (topLeftMargin * 2);
    let pdfHeight = (pdfWidth * 1.5) + (topLeftMargin * 2);

    const canvasImageWidth = htmlWidth;
    const canvasImageHeight = htmlHeight;

    const totalPDFPages = Math.ceil(htmlHeight / pdfHeight) - 1;

    const data = this.document.getElementById('print-section');
    html2canvas(data, { allowTaint: true }).then(canvas => {

      canvas.getContext('2d');
      const imgData = canvas.toDataURL("image/jpeg", 1.0);
      let pdf = new jsPDF('p', 'pt', [pdfWidth, pdfHeight]);
      pdf.addImage(imgData, 'png', topLeftMargin, topLeftMargin, canvasImageWidth, canvasImageHeight);

      for (let i = 1; i <= totalPDFPages; i++) {
        pdf.addPage([pdfWidth, pdfHeight], 'p');
        pdf.addImage(imgData, 'png', topLeftMargin, - (pdfHeight * i) + (topLeftMargin * 4), canvasImageWidth, canvasImageHeight);
      }

      this.loading = false;
      pdf.save(`Barcode(s)${new Date().toLocaleString()}.pdf`);
    });
  }
}

