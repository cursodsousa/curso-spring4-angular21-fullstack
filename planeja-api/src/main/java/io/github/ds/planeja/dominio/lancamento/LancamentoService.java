package io.github.ds.planeja.dominio.lancamento;

import io.github.ds.planeja.common.exceptions.RegistroNaoEncontradoException;
import io.github.ds.planeja.common.exceptions.ValidationException;
import io.github.ds.planeja.dominio.cartao.CartaoRepository;
import io.github.ds.planeja.dominio.cartao.model.CartaoEntity;
import io.github.ds.planeja.dominio.categoria.CategoriaRepository;
import io.github.ds.planeja.dominio.categoria.model.CategoriaEntity;
import io.github.ds.planeja.dominio.lancamento.dto.LancamentoDetalhes;
import io.github.ds.planeja.dominio.lancamento.dto.LancamentoForm;
import io.github.ds.planeja.dominio.lancamento.mapper.LancamentoMapper;
import io.github.ds.planeja.dominio.lancamento.model.TipoLancamento;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.YearMonth;
import java.util.UUID;

@Service
public class LancamentoService {

    @Autowired
    private LancamentoRepository repository;
    @Autowired
    private CategoriaRepository categoriaRepository;
    @Autowired
    private CartaoRepository cartaoRepository;
    @Autowired
    private LancamentoValidator validator;
    @Autowired
    private LancamentoMapper mapper;

    public LancamentoDetalhes criar(LancamentoForm form) {
        CategoriaEntity categoria = categoriaRepository.findById(form.categoriaId()).orElse(null);

        CartaoEntity cartao = null;
        if (form.tipo() == TipoLancamento.DESPESA && form.cartaoId() != null) {
            cartao = cartaoRepository.findById(form.cartaoId()).orElse(null);
        }

        var result = validator.validar(form, categoria, cartao);
        if (result.isInvalido()) {
            throw new ValidationException(result.getCampoInvalidos());
        }

        var entity = mapper.toEntity(form, categoria, cartao);
        repository.save(entity);
        return mapper.toDetalhes(entity);
    }

    public Page<LancamentoDetalhes> listar(PageRequest pageRequest, YearMonth mes, TipoLancamento tipo, UUID categoriaId) {
        var ordenadoPorDataDesc = PageRequest.of(
                pageRequest.getPageNumber(),
                pageRequest.getPageSize(),
                Sort.by(Sort.Direction.DESC, "data")
        );

        var spec = LancamentoSpecifications.porFiltros(mes, tipo, categoriaId);
        return repository.findAll(spec, ordenadoPorDataDesc).map(mapper::toDetalhes);
    }

    @Transactional
    public void deletar(UUID id) {
        var lancamento = repository.findById(id)
                .orElseThrow(RegistroNaoEncontradoException::new);
        repository.delete(lancamento);
    }
}
