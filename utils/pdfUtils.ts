import { UserProfile, Language, TranslationKey } from '../types';

// PDF Export Helper Constants
export const A4_WIDTH_MM = 210;
export const A4_HEIGHT_MM = 297;
export const MARGIN_MM = 15;
export const CONTENT_WIDTH_MM = A4_WIDTH_MM - 2 * MARGIN_MM;
export const LINE_HEIGHT_NORMAL = 6; 
export const LINE_HEIGHT_TITLE = 10; 
export const LINE_HEIGHT_SECTION_TITLE = 8; 

export const TITLE_FONT_SIZE = 20;
export const SECTION_TITLE_FONT_SIZE = 16;
export const TEXT_FONT_SIZE = 10;
export const FOOTER_FONT_SIZE = 8;
export const USER_PHOTO_SIZE_MM = 25;


export const addPageFooter = (doc: any, pageNumber: number, totalPages: number, t: (key: TranslationKey, defaultText?: string) => string) => {
    doc.setFontSize(FOOTER_FONT_SIZE);
    doc.setTextColor(120, 120, 120);
    const footerText = t('page_x_of_y', `Page ${pageNumber} of ${totalPages}`)
                        .replace('{currentPage}', String(pageNumber))
                        .replace('{totalPages}', String(totalPages));
    doc.text(footerText, MARGIN_MM, A4_HEIGHT_MM - MARGIN_MM / 2);
    doc.setTextColor(50, 50, 50); // Reset color for content
};

export const addTextWithPageBreaks = (
    doc: any, 
    text: string | string[], 
    x: number, 
    yRef: { value: number }, 
    options: any, 
    lineHeight: number, 
    totalPagesRef: { current: number },
    t: (key: TranslationKey, defaultText?: string) => string
) => {
    const lines = Array.isArray(text) ? text : doc.splitTextToSize(text, CONTENT_WIDTH_MM - (x - MARGIN_MM));
    lines.forEach((line: string) => {
        if (yRef.value > A4_HEIGHT_MM - MARGIN_MM - lineHeight) {
            addPageFooter(doc, doc.getNumberOfPages(), totalPagesRef.current, t);
            doc.addPage();
            totalPagesRef.current = doc.getNumberOfPages();
            yRef.value = MARGIN_MM;
        }
        doc.text(line, x, yRef.value, options);
        yRef.value += lineHeight;
    });
};

export const addUserProfileHeader = (
    doc: any,
    userProfile: UserProfile | null,
    yRef: { value: number },
    totalPagesRef: { current: number },
    t: (key: TranslationKey, defaultText?: string) => string
) => {
    if (!userProfile) return;

    doc.setFontSize(SECTION_TITLE_FONT_SIZE);
    doc.setFont("helvetica", "bold");
    addTextWithPageBreaks(doc, t('pdf_made_by_title'), MARGIN_MM, yRef, {}, LINE_HEIGHT_SECTION_TITLE, totalPagesRef, t);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(TEXT_FONT_SIZE);

    let textX = MARGIN_MM;
    const profileStartY = yRef.value;

    if (userProfile.photo) {
        try {
            const base64Image = userProfile.photo.split(',')[1] || userProfile.photo;
            const imageType = userProfile.photo.startsWith('data:image/png') ? 'PNG' : 'JPEG';
            doc.addImage(base64Image, imageType, MARGIN_MM, yRef.value, USER_PHOTO_SIZE_MM, USER_PHOTO_SIZE_MM);
            textX = MARGIN_MM + USER_PHOTO_SIZE_MM + 5;
        } catch (e) {
            console.error("Error adding image to PDF:", e);
        }
    }

    const profileDetails = [
        `${t('user_profile_name_label')} ${userProfile.name}`,
        `${t('user_profile_email_label')} ${userProfile.email || '-'}`,
        `${t('user_profile_phone_label')} ${userProfile.phone || '-'}`,
        `${t('user_profile_other_details_label')} ${userProfile.otherDetails || '-'}`
    ];

    const textContentYStart = yRef.value;
    profileDetails.forEach(detail => {
        addTextWithPageBreaks(doc, detail, textX, yRef, {}, LINE_HEIGHT_NORMAL, totalPagesRef, t);
    });

    const textContentYEnd = yRef.value;
    const photoYEnd = profileStartY + USER_PHOTO_SIZE_MM + LINE_HEIGHT_NORMAL;

    // Ensure Y position is below both photo and text
    yRef.value = Math.max(textContentYEnd, userProfile.photo ? photoYEnd : textContentYEnd);
    yRef.value += LINE_HEIGHT_NORMAL; // Add extra space after header
};
