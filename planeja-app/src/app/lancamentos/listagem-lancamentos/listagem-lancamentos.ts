import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Header } from '../../common/components/header/header';
import { PageResult } from '../../common/pagination/page-result';
import { CategoriaService } from '../../categorias/categoria-service';
import { DetalhesCategoria } from '../../categorias/dados-categoria';
import { DetalhesLancamento, TipoLancamento } from '../dados-lancamento';
import { LancamentoService } from '../lancamento-service';

interface FiltrosForm {
  mes: FormControl<string>;
  tipo: FormControl<TipoLancamento | ''>;
  categoriaId: FormControl<string>;
}

@Component({
  selector: 'app-listagem-lancamentos',
  imports: [CommonModule, RouterLink, ReactiveFormsModule, Header],
  templateUrl: './listagem-lancamentos.html',
  styleUrl: './listagem-lancamentos.scss',
})
export class ListagemLancamentos implements OnInit {
  service = inject(LancamentoService);
  categoriaService = inject(CategoriaService);
  toast = inject(ToastrService);

  listagem$!: Observable<PageResult<DetalhesLancamento>>;
  categoriasAtivas: DetalhesCategoria[] = [];
  paginaAtual = 0;
  tamanhoPagina = 5;

  filtrosForm = new FormGroup<FiltrosForm>({
    mes: new FormControl('', { nonNullable: true }),
    tipo: new FormControl<TipoLancamento | ''>('', { nonNullable: true }),
    categoriaId: new FormControl('', { nonNullable: true }),
  });

  ngOnInit(): void {
    this.listarLancamentos();
    this.carregarCategoriasAtivas();
  }

  listarLancamentos(): void {
    const mesInput = this.filtrosForm.controls.mes.value;
    const tipo = this.filtrosForm.controls.tipo.value;
    const categoriaId = this.filtrosForm.controls.categoriaId.value;

    this.listagem$ = this.service.listar({
      page: this.paginaAtual,
      size: this.tamanhoPagina,
      mes: mesInput || undefined,
      tipo: tipo || undefined,
      categoriaId: categoriaId || undefined,
    });
  }

  carregarCategoriasAtivas(): void {
    this.categoriaService.listar(0, 200).subscribe({
      next: (resultado) => {
        this.categoriasAtivas = resultado.content.filter((categoria) => categoria.ativo);
      },
      error: () => this.toast.error('Erro ao carregar categorias para filtro.'),
    });
  }

  aplicarFiltros(): void {
    this.paginaAtual = 0;
    this.listarLancamentos();
  }

  limparFiltros(): void {
    this.filtrosForm.reset({
      mes: '',
      tipo: '',
      categoriaId: '',
    });
    this.aplicarFiltros();
  }

  deletar(id: string): void {
    this.service.deletar(id).subscribe({
      next: () => {
        this.toast.success('Lancamento excluido com sucesso!');
        this.listarLancamentos();
      },
      error: () => this.toast.error('Erro ao excluir lancamento.'),
    });
  }

  navegar(pagina: number): void {
    this.paginaAtual = pagina;
    this.listarLancamentos();
  }

  navegarProximo(listagem: PageResult<DetalhesLancamento>): void {
    if (!listagem.last) {
      this.navegar(listagem.number + 1);
    }
  }

  navegarAnterior(listagem: PageResult<DetalhesLancamento>): void {
    if (!listagem.first) {
      this.navegar(listagem.number - 1);
    }
  }

  paginas(totalPages: number): number[] {
    return Array.from({ length: totalPages }, (_value, index) => index);
  }

  registroInicial(listagem: PageResult<DetalhesLancamento>): number {
    if (listagem.totalElements === 0) {
      return 0;
    }
    return listagem.number * listagem.size + 1;
  }

  registroFinal(listagem: PageResult<DetalhesLancamento>): number {
    if (listagem.totalElements === 0) {
      return 0;
    }
    return Math.min((listagem.number + 1) * listagem.size, listagem.totalElements);
  }
}
