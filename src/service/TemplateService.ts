import { IChecklistDocument } from "../model/IChecklistDocument";
import { ICheckList, IParseResult } from "../model/IParseResult";
import ghDownloader  from "./GHDownloader";
import ghParser from "./GHParser";

class TemplateService {

    parsed!: IParseResult;
    files!: import("/workspaces/fta-aas/src/model/IGHFileList").IGHFileList;

    async init(){
        this.files = await ghDownloader.getAllFiles();
        this.parsed = ghParser.parse(this.files);
    }

    getPathforTechAndLanguage(tech : string, language : string) : string {
        console.log(this.files);
        var the_url = this.files.tree.find(ti => ti.path.match(tech) && ti.path.match(language))?.url;
        console.log('found url: ' + the_url);
        return the_url ? the_url.toString() : "" ;
    }

    getAvailableTemplates(): Promise<string[]> {
        // TODO: Get list of templates from github.com

        // fake result
        return Promise.resolve(["https://raw.githubusercontent.com/Azure/review-checklists/main/checklists/aks_checklist.en.json",
            "https://raw.githubusercontent.com/Azure/review-checklists/main/checklists/avd_checklist.en.json",
            "https://raw.githubusercontent.com/Azure/review-checklists/main/checklists/lz_checklist.en.json",
            "https://raw.githubusercontent.com/Azure/review-checklists/main/checklists/multitenancy_checklist.en.json",
            "https://raw.githubusercontent.com/Azure/review-checklists/main/checklists/security_checklist.en.json"]);
    }

    getAvailableTemplateNames(): string[] {

        var result : string[] = [];
        this.parsed.checklists.forEach((element: ICheckList) => {
            result.push(element.name);
        });
        return result;
    }

    getAvailableLanguagesforTemplate(checklistname : string): string[] {
        console.log(this.parsed.checklists);
        for (var element of this.parsed.checklists){
            if ( element.name === checklistname) {
                return element.languages;
            }
        }
        return [];
    }

    async openTemplate(url: string): Promise<IChecklistDocument> {
        const response = await fetch(url);
        return (await response.json()) as IChecklistDocument;
    }
}

const TemplateServiceInstance = new TemplateService();

export default TemplateServiceInstance;