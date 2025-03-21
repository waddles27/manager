import {Component, computed, inject, Signal} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {toSignal} from '@angular/core/rxjs-interop';
import {Router} from '@angular/router';
import {ProjectService} from '../../services/project.service';
import {MatInputModule} from '@angular/material/input';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-add-project',
    imports: [
        ReactiveFormsModule,
        MatInputModule,
        MatButton
    ],
  templateUrl: './add-project.component.html'
})
export class AddProjectComponent {

    private readonly _projectService = inject(ProjectService);
    private readonly _router = inject(Router);

    public readonly isInvalidState: Signal<boolean> = computed(() => {
        return this.createFormStatusChanges() != 'VALID';
    });

    public createForm: FormGroup = new FormGroup({
        code: new FormControl<string>("", [Validators.required]),
        name: new FormControl<string>("", [Validators.required]),
        description: new FormControl<string>(""),
    });

    public createFormStatusChanges = toSignal(this.createForm.statusChanges);

    public get code(): FormControl {
        return this.createForm.controls['code'] as FormControl;
    }

    public get name(): FormControl {
        return this.createForm.controls['name'] as FormControl;
    }

    public onCreate() {
        if (this.isInvalidState()) return;

        this._projectService.createProject(this.createForm.value).subscribe({
            next: data => {
                let projectUrl = this._router.createUrlTree([data.id]);
                this._router.navigateByUrl(projectUrl).then(r => {});
            }
        });
    }
}
