import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserSkillService } from 'src/app/services/user-skill.service';
import { SkillInterface } from 'src/app/interfaces/skill-interface';
import { UserService } from 'src/app/services/user.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-skill',
  templateUrl: './user-skill.component.html',
  styleUrls: ['./user-skill.component.scss']
  
})
export class UserSkillComponent implements OnInit {
  skills: SkillInterface[] = [];
  levels!: string[];
  skillForm!: FormGroup;
  userId!: string;
  showAddSkill: boolean = false;
  editingSkill: boolean = false;
  editingSkillId: number | null = null;
  isAddingSkill: boolean = false;
  userIdParam!: string;
  userSkillsParam!: SkillInterface[];

  constructor(
    private fb: FormBuilder,
    private userSkillService: UserSkillService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      this.userIdParam = id!;
    });

    const userString = localStorage.getItem('user');
    if (userString) { 
      const user = JSON.parse(userString);
      const id = user.user.id;
      if (id) {
        this.userId = id;
        this.loadUserSkills();
        this.loadLevels();
      } else {
        console.error('User ID not found in parsed object');
      }
    } else {
      console.error('User not found in localStorage');
    }

    this.skillForm = this.fb.group({
      name: ['', Validators.required],
      level: ['', Validators.required],
      description: ['', Validators.required],
      certificateBy: ['', Validators.required],
      certificateDate: ['', Validators.required]
    });
  }

  loadUserSkills(): void {
    this.userSkillService.getSkills(this.userIdParam).subscribe(skills => {
      this.skills = skills;
    }, error => {
      console.error('Errore nel recupero delle competenze', error);
    });
  }

  loadLevels(): void {
    this.userSkillService.getLevelList().subscribe(levels => {
      this.levels = levels;
    }, error => {
      console.error('Errore nel recupero dei livelli', error);
    });
  }

  addSkill(): void {
    if (this.skillForm.valid) {
      this.userSkillService.createSkill(this.skillForm.value, this.userId).subscribe(() => {
        this.loadUserSkills();
        this.resetForm();
      }, error => {
        console.error('Errore durante la creazione della skill', error);
      });
    }
  }

  editSkill(skill: SkillInterface): void {
    this.skillForm.patchValue(skill);
    this.editingSkill = true;
    this.editingSkillId = skill.id;
    this.showAddSkill = true;
  }

  updateSkill(): void {
    if (this.skillForm.valid && this.editingSkillId !== null) {
      this.userSkillService.editSkill(this.skillForm.value, this.editingSkillId, this.userId).subscribe(() => {
        this.loadUserSkills();
        this.resetForm();
      }, error => {
        console.error('Errore durante la modifica della skill', error);
      });
    }
  }

  deleteSkill(id: number): void {
    this.userSkillService.deleteSkill(id).subscribe(() => {
      this.loadUserSkills();
    }, error => {
      console.error('Errore durante l\'eliminazione della skill', error);
    });
  }

  toggleAddSkill(): void {
    this.showAddSkill = !this.showAddSkill;
    this.isAddingSkill = !this.isAddingSkill;
    if (!this.showAddSkill) {
      this.resetForm();
    }
  }
  

  private resetForm(): void {
    this.skillForm.reset();
    this.editingSkill = false;
    this.editingSkillId = null;
    this.showAddSkill = false;
  }
}
